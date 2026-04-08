const axios = require("axios");
const ApiCache = require("../model/ApiCache");

const BASE_URL = "https://api.football-data.org/v4";

// football-data.org competition codes → our league IDs (for frontend compatibility)
const COMPETITIONS = {
  PL: { code: "PL", id: 39, name: "Premier League" },
  PD: { code: "PD", id: 140, name: "La Liga" },
  SA: { code: "SA", id: 135, name: "Serie A" },
  BL1: { code: "BL1", id: 78, name: "Bundesliga" },
  FL1: { code: "FL1", id: 61, name: "Ligue 1" },
  CL: { code: "CL", id: 2, name: "Champions League" },
};

// Map our frontend league IDs to football-data.org codes
const ID_TO_CODE = {
  39: "PL",
  140: "PD",
  135: "SA",
  78: "BL1",
  61: "FL1",
  2: "CL",
};

// Status mapping: football-data.org → API-Football format (used by frontend)
function mapStatus(status) {
  const map = {
    SCHEDULED: "NS",
    TIMED: "NS",
    FINISHED: "FT",
    IN_PLAY: "LIVE",
    PAUSED: "HT",
    POSTPONED: "PST",
    CANCELLED: "CANC",
    SUSPENDED: "SUSP",
    AWARDED: "FT",
  };
  return map[status] || "NS";
}

async function cachedCall(endpoint, params = {}) {
  const cacheKey = `fdo:${endpoint}?${new URLSearchParams(params).toString()}`;

  const cached = await ApiCache.findOne({ key: cacheKey });
  if (cached) return cached.data;

  const apiKey = process.env.FOOTBALL_DATA_KEY;
  if (!apiKey) throw new Error("FOOTBALL_DATA_KEY not configured");

  const response = await axios.get(`${BASE_URL}${endpoint}`, {
    headers: { "X-Auth-Token": apiKey },
    params,
  });

  await ApiCache.findOneAndUpdate(
    { key: cacheKey },
    { key: cacheKey, data: response.data, createdAt: new Date() },
    { upsert: true }
  );

  return response.data;
}

// Transform a football-data.org standing row to our frontend format
function mapStandingRow(row) {
  return {
    rank: row.position,
    team: {
      id: row.team.id,
      name: row.team.shortName || row.team.name,
      logo: row.team.crest,
    },
    points: row.points,
    goalsDiff: row.goalDifference,
    all: {
      played: row.playedGames,
      win: row.won,
      draw: row.draw,
      lose: row.lost,
      goals: { for: row.goalsFor, against: row.goalsAgainst },
    },
    form: row.form || "",
  };
}

// Transform a football-data.org match to our Fixture format
function mapMatch(match, competition) {
  return {
    fixture: {
      id: match.id,
      date: match.utcDate,
      status: {
        short: mapStatus(match.status),
        elapsed: match.minute || null,
      },
    },
    teams: {
      home: {
        id: match.homeTeam.id,
        name: match.homeTeam.shortName || match.homeTeam.name,
        logo: match.homeTeam.crest,
        winner: match.score?.winner === "HOME_TEAM",
      },
      away: {
        id: match.awayTeam.id,
        name: match.awayTeam.shortName || match.awayTeam.name,
        logo: match.awayTeam.crest,
        winner: match.score?.winner === "AWAY_TEAM",
      },
    },
    goals: {
      home: match.score?.fullTime?.home,
      away: match.score?.fullTime?.away,
    },
    league: {
      id: competition?.id || 0,
      name: competition?.name || "",
      logo: competition?.emblem || "",
    },
  };
}

// Fetch standings for a league
async function fetchStandings(leagueId) {
  const code = ID_TO_CODE[leagueId];
  if (!code) throw new Error(`Unknown league ID: ${leagueId}`);

  const data = await cachedCall(`/competitions/${code}/standings`);
  if (!data.standings || data.standings.length === 0) return [];

  // Return in the same nested format the frontend expects: [[rows]]
  const totalTable = data.standings.find((s) => s.type === "TOTAL");
  if (!totalTable) return [];

  return [totalTable.table.map(mapStandingRow)];
}

// Fetch recent + upcoming fixtures for a league
async function fetchRecentAndUpcoming(leagueId, recentCount = 15, upcomingCount = 15) {
  const code = ID_TO_CODE[leagueId];
  if (!code) throw new Error(`Unknown league ID: ${leagueId}`);

  const data = await cachedCall(`/competitions/${code}/matches`);
  const comp = { id: COMPETITIONS[code].id, name: COMPETITIONS[code].name, emblem: data.competition?.emblem };

  const matches = data.matches || [];

  const finished = matches
    .filter((m) => m.status === "FINISHED")
    .map((m) => mapMatch(m, comp))
    .sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date))
    .slice(0, recentCount);

  const upcoming = matches
    .filter((m) => ["SCHEDULED", "TIMED"].includes(m.status))
    .map((m) => mapMatch(m, comp))
    .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
    .slice(0, upcomingCount);

  const live = matches
    .filter((m) => ["IN_PLAY", "PAUSED"].includes(m.status))
    .map((m) => mapMatch(m, comp));

  return { recent: finished, upcoming, live };
}

// Fetch today's matches across all our competitions
async function fetchTodayMatches() {
  const today = new Date().toISOString().split("T")[0];
  const data = await cachedCall("/matches", { date: today });

  const validIds = new Set(Object.values(COMPETITIONS).map((c) => c.id));
  const matches = data.matches || [];

  return matches
    .filter((m) => {
      const compCode = Object.keys(COMPETITIONS).find(
        (k) => COMPETITIONS[k].name === m.competition?.name
      );
      return !!compCode;
    })
    .map((m) => {
      const compCode = Object.keys(COMPETITIONS).find(
        (k) => COMPETITIONS[k].name === m.competition?.name
      );
      const comp = compCode ? COMPETITIONS[compCode] : { id: 0, name: "" };
      return mapMatch(m, { id: comp.id, name: comp.name, emblem: m.competition?.emblem });
    });
}

// Fetch top scorers for a league
async function fetchScorers(leagueId) {
  const code = ID_TO_CODE[leagueId];
  if (!code) throw new Error(`Unknown league ID: ${leagueId}`);

  try {
    const data = await cachedCall(`/competitions/${code}/scorers`, { limit: 20 });
    return (data.scorers || []).map((s) => ({
      player: {
        id: s.player.id,
        name: s.player.name,
        firstname: s.player.firstName || "",
        lastname: s.player.lastName || "",
        photo: null,
        nationality: s.player.nationality || "",
      },
      statistics: [
        {
          team: {
            id: s.team.id,
            name: s.team.shortName || s.team.name,
            logo: s.team.crest,
          },
          goals: { total: s.goals, assists: s.assists || 0 },
          games: { appearences: s.playedMatches },
        },
      ],
    }));
  } catch {
    return [];
  }
}

// Fetch all EPL teams + squads and sync to FootballPlayer collection
async function syncEPLPlayers() {
  const FootballPlayer = require("../model/FootballPlayer");

  // Fetch all teams with squads
  const teamsData = await cachedCall("/competitions/PL/teams");
  const teams = teamsData.teams || [];

  // Fetch top scorers for stats
  let scorersMap = {};
  try {
    const scorersData = await cachedCall("/competitions/PL/scorers", { limit: 100 });
    for (const s of scorersData.scorers || []) {
      scorersMap[s.player.id] = {
        goals: s.goals || 0,
        assists: s.assists || 0,
        played: s.playedMatches || 0,
        penalties: s.penalties || 0,
      };
    }
  } catch { /* scorers may fail on free tier */ }

  function mapPosition(pos) {
    if (!pos) return "MID";
    const p = pos.toLowerCase();
    if (p.includes("goalkeeper")) return "GK";
    if (p.includes("back") || p.includes("centre-back") || p.includes("defence")) return "DEF";
    if (p.includes("forward") || p.includes("striker") || p.includes("winger") || p === "offence") return "FWD";
    return "MID"; // Midfield, Defensive Midfield, Attacking Midfield, Central Midfield, etc.
  }

  function calcPrice(position, stats) {
    // Base price by position + bonus for goals/assists
    const base = { GK: 4.5, DEF: 5.0, MID: 6.0, FWD: 7.0 };
    let price = base[position] || 5.0;
    if (stats) {
      price += stats.goals * 0.3;
      price += (stats.assists || 0) * 0.15;
    }
    return Math.round(price * 10) / 10; // Round to 1 decimal
  }

  let synced = 0;

  for (const team of teams) {
    const squad = team.squad || [];
    for (const player of squad) {
      const position = mapPosition(player.position);
      const stats = scorersMap[player.id];
      const price = calcPrice(position, stats);

      await FootballPlayer.findOneAndUpdate(
        { apiId: player.id },
        {
          apiId: player.id,
          name: player.name,
          firstname: player.name.split(" ").slice(0, -1).join(" ") || player.name,
          lastname: player.name.split(" ").slice(-1)[0] || "",
          nationality: player.nationality || "",
          photo: "",
          club: team.shortName || team.name,
          clubLogo: team.crest || "",
          league: "Premier League",
          leagueId: 39,
          position,
          price,
          stats: {
            appearances: stats?.played || 0,
            goals: stats?.goals || 0,
            assists: stats?.assists || 0,
            cleanSheets: 0,
            yellowCards: 0,
            redCards: 0,
            minutesPlayed: 0,
          },
        },
        { upsert: true, new: true }
      );
      synced++;
    }
  }

  console.log(`[Sync] Synced ${synced} EPL players from football-data.org`);
  return { totalSynced: synced, source: "football-data.org" };
}

module.exports = {
  COMPETITIONS,
  ID_TO_CODE,
  fetchStandings,
  fetchRecentAndUpcoming,
  fetchTodayMatches,
  fetchScorers,
  syncEPLPlayers,
};
