const {
  fetchPlayers,
  mapApiPosition,
  calculateFantasyPoints,
  getSeason,
} = require("./apiFootball");
const FootballPlayer = require("../model/FootballPlayer");
const PlayerSnapshot = require("../model/PlayerSnapshot");
const Gameweek = require("../model/Gameweek");
const FantasyTeam = require("../model/FantasyTeam");
const SyncLog = require("../model/SyncLog");

const LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
  { id: 2, name: "Champions League" },
];

// Core sync logic - works for both manual and auto triggers
async function syncLeague(leagueId, season = getSeason()) {
  // Get or create current gameweek
  let currentGw = await Gameweek.findOne({ isCurrent: true });
  if (!currentGw) {
    const lastGw = await Gameweek.findOne().sort({ number: -1 });
    const gwNumber = lastGw ? lastGw.number + 1 : 1;
    currentGw = await Gameweek.create({
      number: gwNumber,
      label: `Gameweek ${gwNumber}`,
      startDate: new Date(),
      isCurrent: true,
      isActive: true,
    });
  }

  let page = 1;
  let totalSynced = 0;
  let hasMore = true;
  let pointsUpdated = 0;

  while (hasMore && page <= 5) {
    const data = await fetchPlayers(Number(leagueId), Number(season), page);
    const players = data.response || [];

    if (players.length === 0) {
      hasMore = false;
      break;
    }

    for (const item of players) {
      const player = item.player;
      const stat = item.statistics?.[0];
      if (!stat || !stat.team) continue;

      const position = mapApiPosition(stat.games?.position || "Midfielder");
      const priceMap = { GK: 4.5, DEF: 5.0, MID: 6.0, FWD: 7.0 };

      const newStats = {
        appearances: stat.games?.appearences || 0,
        goals: stat.goals?.total || 0,
        assists: stat.goals?.assists || 0,
        cleanSheets: stat.goals?.saves ? Math.floor(stat.goals.saves / 3) : 0,
        yellowCards: stat.cards?.yellow || 0,
        redCards: stat.cards?.red || 0,
        minutesPlayed: stat.games?.minutes || 0,
      };

      const existing = await FootballPlayer.findOne({ apiId: player.id });

      let gwPoints = 0;
      if (existing) {
        const diff = {
          goals: Math.max(0, newStats.goals - (existing.stats?.goals || 0)),
          assists: Math.max(0, newStats.assists - (existing.stats?.assists || 0)),
          cleanSheets: Math.max(0, newStats.cleanSheets - (existing.stats?.cleanSheets || 0)),
          yellowCards: Math.max(0, newStats.yellowCards - (existing.stats?.yellowCards || 0)),
          redCards: Math.max(0, newStats.redCards - (existing.stats?.redCards || 0)),
          minutesPlayed: Math.max(0, newStats.minutesPlayed - (existing.stats?.minutesPlayed || 0)),
        };
        gwPoints = calculateFantasyPoints(diff, position);
      }

      const updatedPlayer = await FootballPlayer.findOneAndUpdate(
        { apiId: player.id },
        {
          apiId: player.id,
          name: player.name,
          firstname: player.firstname || "",
          lastname: player.lastname || "",
          age: player.age,
          nationality: player.nationality || "",
          photo: player.photo || "",
          club: stat.team.name || "",
          clubLogo: stat.team.logo || "",
          league: stat.league?.name || "Premier League",
          leagueId: stat.league?.id || 39,
          position,
          price: priceMap[position] || 5.0,
          stats: newStats,
          $inc: { totalPoints: gwPoints },
        },
        { upsert: true, new: true }
      );

      if (gwPoints !== 0 || !existing) {
        await PlayerSnapshot.findOneAndUpdate(
          { playerId: updatedPlayer._id, gameweek: currentGw.number },
          {
            playerId: updatedPlayer._id,
            gameweek: currentGw.number,
            stats: newStats,
            gameweekPoints: gwPoints,
          },
          { upsert: true }
        );
        pointsUpdated++;
      }

      totalSynced++;
    }

    const paging = data.paging;
    hasMore = paging && page < paging.total;
    page++;
  }

  return { totalSynced, pointsUpdated, gameweek: currentGw.number };
}

// Update all fantasy team scores
async function updateTeamScores(gameweekNumber) {
  const teams = await FantasyTeam.find().populate("players.playerId");
  for (const team of teams) {
    let gwTotal = 0;
    for (const slot of team.players) {
      const snapshot = await PlayerSnapshot.findOne({
        playerId: slot.playerId._id || slot.playerId,
        gameweek: gameweekNumber,
      });
      if (snapshot) {
        let pts = snapshot.gameweekPoints;
        if (slot.isCaptain) pts *= 2;
        gwTotal += pts;
      }
    }
    team.gameweekPoints = gwTotal;
    team.totalPoints = (team.totalPoints || 0) + gwTotal;
    await team.save();
  }
  return teams.length;
}

// Advance to next gameweek
async function advanceToNextGameweek() {
  await Gameweek.updateMany({}, { isCurrent: false, isActive: false });
  const lastGw = await Gameweek.findOne().sort({ number: -1 });
  const gwNumber = lastGw ? lastGw.number + 1 : 1;
  const gw = await Gameweek.create({
    number: gwNumber,
    label: `Gameweek ${gwNumber}`,
    startDate: new Date(),
    isCurrent: true,
    isActive: true,
  });
  return gw;
}

// Auto-sync all leagues (called by cron)
async function autoSyncAllLeagues() {
  console.log(`[Auto-Sync] Starting at ${new Date().toISOString()}`);
  const results = [];

  for (const league of LEAGUES) {
    try {
      const result = await syncLeague(league.id);
      await SyncLog.create({
        type: "player-sync",
        leagueId: league.id,
        leagueName: league.name,
        trigger: "auto",
        status: "success",
        totalSynced: result.totalSynced,
        pointsUpdated: result.pointsUpdated,
        gameweek: result.gameweek,
      });
      results.push({ league: league.name, ...result });
      console.log(`[Auto-Sync] ${league.name}: ${result.totalSynced} players, ${result.pointsUpdated} scored`);
    } catch (err) {
      await SyncLog.create({
        type: "player-sync",
        leagueId: league.id,
        leagueName: league.name,
        trigger: "auto",
        status: "failed",
        error: err.message,
      });
      console.error(`[Auto-Sync] ${league.name} failed:`, err.message);
      results.push({ league: league.name, error: err.message });
    }
  }

  // Update team scores after syncing all leagues
  if (results.some((r) => !r.error)) {
    const currentGw = await Gameweek.findOne({ isCurrent: true });
    if (currentGw) {
      const teamsUpdated = await updateTeamScores(currentGw.number);
      console.log(`[Auto-Sync] Updated ${teamsUpdated} fantasy teams`);
    }
  }

  console.log(`[Auto-Sync] Completed at ${new Date().toISOString()}`);
  return results;
}

// Auto-advance gameweek (called by cron on Mondays)
async function autoAdvanceGameweek() {
  try {
    const currentGw = await Gameweek.findOne({ isCurrent: true });
    if (!currentGw) {
      console.log("[Auto-Advance] No current gameweek, skipping");
      return null;
    }

    const gw = await advanceToNextGameweek();
    await SyncLog.create({
      type: "gameweek-advance",
      trigger: "auto",
      status: "success",
      gameweek: gw.number,
    });
    console.log(`[Auto-Advance] Advanced to Gameweek ${gw.number}`);
    return gw;
  } catch (err) {
    await SyncLog.create({
      type: "gameweek-advance",
      trigger: "auto",
      status: "failed",
      error: err.message,
    });
    console.error("[Auto-Advance] Failed:", err.message);
    return null;
  }
}

module.exports = {
  LEAGUES,
  syncLeague,
  updateTeamScores,
  advanceToNextGameweek,
  autoSyncAllLeagues,
  autoAdvanceGameweek,
};
