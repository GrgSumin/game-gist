const {
  fetchLeagues,
  fetchFixtures,
  fetchLeagueRecentAndUpcoming,
  fetchTodayFixtures,
  fetchStandings,
  fetchTopScorers,
  fetchTopAssists,
  LEAGUES,
  CURRENT_SEASON,
} = require("../services/apiFootball");
const FootballPlayer = require("../model/FootballPlayer");
const PlayerSnapshot = require("../model/PlayerSnapshot");
const Gameweek = require("../model/Gameweek");
const SyncLog = require("../model/SyncLog");
const {
  syncLeague,
  updateTeamScores,
  advanceToNextGameweek,
} = require("../services/syncService");

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

// Dashboard fixtures - recent + upcoming from ALL leagues + today's matches
exports.getDashboardFixtures = async (req, res) => {
  try {
    const leagueIds = Object.values(LEAGUES);

    // Fetch all 3 leagues in parallel + today's cross-league fixtures
    const [todayAll, ...leagueResults] = await Promise.all([
      fetchTodayFixtures(),
      ...leagueIds.map((id) => fetchLeagueRecentAndUpcoming(id, 5, 5)),
    ]);

    const recent = [];
    const upcoming = [];
    const live = [];

    for (const result of leagueResults) {
      recent.push(...result.recent);
      upcoming.push(...result.upcoming);
      live.push(...result.live);
    }

    // Add today's fixtures that aren't already in the lists
    const existingIds = new Set([...recent, ...upcoming, ...live].map((f) => f.fixture.id));
    for (const f of todayAll) {
      if (!existingIds.has(f.fixture.id)) {
        if (f.fixture.status.short === "NS") upcoming.push(f);
        else if (f.fixture.status.short === "FT") recent.push(f);
        else live.push(f);
      }
    }

    recent.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
    upcoming.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    res.json({ recent: recent.slice(0, 10), upcoming: upcoming.slice(0, 10), live });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard fixtures" });
  }
};

// Browse fixtures for a single league
exports.getLeagueFixtures = async (req, res) => {
  try {
    const { league = 39 } = req.query;
    const result = await fetchLeagueRecentAndUpcoming(Number(league), 15, 15);

    res.json({
      recent: result.recent,
      upcoming: result.upcoming,
      live: result.live,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch league fixtures" });
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

// Sync players (manual trigger from admin)
exports.syncPlayers = async (req, res) => {
  try {
    const { league = 39, season = CURRENT_SEASON } = req.query;
    const leagueName = { 39: "Premier League", 2: "Champions League", 78: "Bundesliga" }[league] || "Unknown";

    const result = await syncLeague(Number(league), Number(season));
    const teamsUpdated = await updateTeamScores(result.gameweek);

    await SyncLog.create({
      type: "player-sync",
      leagueId: Number(league),
      leagueName,
      trigger: "manual",
      status: "success",
      totalSynced: result.totalSynced,
      pointsUpdated: result.pointsUpdated,
      gameweek: result.gameweek,
    });

    res.json({
      message: `Synced ${result.totalSynced} players, ${result.pointsUpdated} scored points`,
      totalSynced: result.totalSynced,
      pointsUpdated: result.pointsUpdated,
      gameweek: result.gameweek,
      teamsUpdated,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to sync players: " + err.message });
  }
};

// Advance to next gameweek (manual trigger)
exports.advanceGameweek = async (req, res) => {
  try {
    const gw = await advanceToNextGameweek();

    await SyncLog.create({
      type: "gameweek-advance",
      trigger: "manual",
      status: "success",
      gameweek: gw.number,
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

// Get sync logs (for admin panel)
exports.getSyncLogs = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const logs = await SyncLog.find().sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sync logs" });
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
