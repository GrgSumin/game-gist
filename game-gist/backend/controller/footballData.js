const {
  fetchLeagues,
  fetchFixtures,
  fetchPlayers,
  fetchStandings,
  fetchTopScorers,
  fetchTopAssists,
  mapApiPosition,
  calculateFantasyPoints,
  CURRENT_SEASON,
} = require("../services/apiFootball");
const FootballPlayer = require("../model/FootballPlayer");
const PlayerSnapshot = require("../model/PlayerSnapshot");
const Gameweek = require("../model/Gameweek");
const FantasyTeam = require("../model/FantasyTeam");

exports.getLeagues = async (req, res) => {
  try {
    const leagues = await fetchLeagues();
    res.json({ leagues });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leagues" });
  }
};

exports.getFixtures = async (req, res) => {
  try {
    const { league = 39, season = CURRENT_SEASON } = req.query;
    const fixtures = await fetchFixtures(Number(league), Number(season));
    res.json({ fixtures });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
};

exports.getStandings = async (req, res) => {
  try {
    const { league = 39, season = CURRENT_SEASON } = req.query;
    const standings = await fetchStandings(Number(league), Number(season));
    res.json({ standings });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch standings" });
  }
};

exports.getTopScorers = async (req, res) => {
  try {
    const { league = 39, season = CURRENT_SEASON } = req.query;
    const scorers = await fetchTopScorers(Number(league), Number(season));
    res.json({ scorers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top scorers" });
  }
};

exports.getTopAssists = async (req, res) => {
  try {
    const { league = 39, season = CURRENT_SEASON } = req.query;
    const assists = await fetchTopAssists(Number(league), Number(season));
    res.json({ assists });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top assists" });
  }
};

// Sync players AND calculate gameweek points from stat diffs
exports.syncPlayers = async (req, res) => {
  try {
    const { league = 39, season = CURRENT_SEASON } = req.query;

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
      const data = await fetchPlayers(Number(league), Number(season), page);
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

        // Get existing player to compare stats
        const existing = await FootballPlayer.findOne({ apiId: player.id });

        // Calculate diff-based gameweek points
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

        // Update player
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

        // Save snapshot for this gameweek
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

    // Update fantasy team scores for this gameweek
    const teams = await FantasyTeam.find().populate("players.playerId");
    for (const team of teams) {
      let gwTotal = 0;
      for (const slot of team.players) {
        const snapshot = await PlayerSnapshot.findOne({
          playerId: slot.playerId._id || slot.playerId,
          gameweek: currentGw.number,
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

    res.json({
      message: `Synced ${totalSynced} players, ${pointsUpdated} scored points`,
      totalSynced,
      pointsUpdated,
      gameweek: currentGw.number,
      teamsUpdated: teams.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync players: " + err.message });
  }
};

// Advance to next gameweek (call after each sync)
exports.advanceGameweek = async (req, res) => {
  try {
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
    res.json({ gameweek: gw });
  } catch (err) {
    res.status(500).json({ error: "Failed to advance gameweek" });
  }
};

// Get gameweek history
exports.getGameweeks = async (req, res) => {
  try {
    const gameweeks = await Gameweek.find().sort({ number: -1 });
    res.json({ gameweeks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gameweeks" });
  }
};

// Get player's gameweek history
exports.getPlayerGameweekHistory = async (req, res) => {
  try {
    const snapshots = await PlayerSnapshot.find({ playerId: req.params.id })
      .sort({ gameweek: -1 })
      .limit(20);
    res.json({ snapshots });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

exports.getPlayers = async (req, res) => {
  try {
    const { league, position, club, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (league) filter.leagueId = Number(league);
    if (position) filter.position = position;
    if (club) filter.club = new RegExp(club, "i");
    if (search) filter.name = new RegExp(search, "i");

    const skip = (Number(page) - 1) * Number(limit);
    const [players, total] = await Promise.all([
      FootballPlayer.find(filter)
        .sort({ totalPoints: -1 })
        .skip(skip)
        .limit(Number(limit)),
      FootballPlayer.countDocuments(filter),
    ]);

    res.json({
      players,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const player = await FootballPlayer.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });
    res.json({ player });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch player" });
  }
};
