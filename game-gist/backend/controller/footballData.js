const {
  fetchLeagues,
  fetchFixtures,
  fetchRecentFixtures,
  fetchUpcomingFixtures,
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

// Dashboard fixtures - recent + upcoming from ALL leagues
exports.getDashboardFixtures = async (req, res) => {
  try {
    const { last = 5, next = 5 } = req.query;
    const leagueIds = Object.values(LEAGUES);

    const promises = leagueIds.flatMap((id) => [
      fetchRecentFixtures(id, Number(last)),
      fetchUpcomingFixtures(id, Number(next)),
    ]);

    const results = await Promise.all(promises);
    const recent = [];
    const upcoming = [];

    for (let i = 0; i < results.length; i++) {
      if (i % 2 === 0) recent.push(...results[i]);
      else upcoming.push(...results[i]);
    }

    recent.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
    upcoming.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    res.json({ recent, upcoming });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard fixtures" });
  }
};

// Browse fixtures for a single league
exports.getLeagueFixtures = async (req, res) => {
  try {
    const { league = 39, last = 10, next = 10 } = req.query;
    const [recent, upcoming] = await Promise.all([
      fetchRecentFixtures(Number(league), Number(last)),
      fetchUpcomingFixtures(Number(league), Number(next)),
    ]);

    recent.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date));
    upcoming.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

    res.json({ recent, upcoming });
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
