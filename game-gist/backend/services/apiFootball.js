const axios = require("axios");
const ApiCache = require("../model/ApiCache");

const BASE_URL = "https://v3.football.api-sports.io";

const LEAGUES = {
  EPL: 39,           // Premier League (England)
  LA_LIGA: 140,      // La Liga (Spain)
  SERIE_A: 135,      // Serie A (Italy)
  BUNDESLIGA: 78,    // Bundesliga (Germany)
  LIGUE_1: 61,       // Ligue 1 (France)
  UCL: 2,            // UEFA Champions League
};

// Dynamic season detection — resolved at startup, re-checked daily
let activeSeason = null;

async function detectSeason() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  // Football seasons run Jul–Jun. If month >= 7, new season = this year. Otherwise, last year.
  const expected = month >= 7 ? year : year - 1;

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    console.log(`[Season] No API key, defaulting to season ${expected}`);
    activeSeason = expected;
    return activeSeason;
  }

  try {
    // Check if the expected season has fixture data (use EPL as reference)
    const response = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { "x-apisports-key": apiKey },
      params: { league: 39, season: expected },
    });

    const count = response.data?.results || 0;
    if (count > 0) {
      activeSeason = expected;
      console.log(`[Season] Using season ${activeSeason} (${count} EPL fixtures found)`);
    } else {
      // No data for expected season yet — fall back to previous year
      activeSeason = expected - 1;
      console.log(`[Season] Season ${expected} has no data yet, falling back to ${activeSeason}`);
    }
  } catch (err) {
    // On error, fall back gracefully
    activeSeason = activeSeason || expected - 1;
    console.error(`[Season] Detection failed: ${err.message}, using ${activeSeason}`);
  }

  return activeSeason;
}

function getSeason() {
  // If detectSeason hasn't run yet, calculate a sensible default
  if (activeSeason === null) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return month >= 7 ? year : year - 1;
  }
  return activeSeason;
}

async function cachedApiCall(endpoint, params = {}) {
  const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;

  const cached = await ApiCache.findOne({ key: cacheKey });
  if (cached) {
    return cached.data;
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY not configured");
  }

  const response = await axios.get(`${BASE_URL}${endpoint}`, {
    headers: { "x-apisports-key": apiKey },
    params,
  });

  await ApiCache.findOneAndUpdate(
    { key: cacheKey },
    { key: cacheKey, data: response.data, createdAt: new Date() },
    { upsert: true }
  );

  return response.data;
}

async function fetchLeagues() {
  const leagueIds = Object.values(LEAGUES);
  const results = [];

  for (const id of leagueIds) {
    const data = await cachedApiCall("/leagues", { id });
    if (data.response && data.response.length > 0) {
      results.push(data.response[0]);
    }
  }
  return results;
}

async function fetchFixtures(leagueId, season = getSeason()) {
  const data = await cachedApiCall("/fixtures", { league: leagueId, season });
  return data.response || [];
}

// Fetch fixtures for a specific date (works on free tier)
function formatDate(d) {
  return d.toISOString().split("T")[0];
}

async function fetchFixturesByDate(date) {
  const data = await cachedApiCall("/fixtures", { date: formatDate(date) });
  return data.response || [];
}

// Fetch recent + upcoming fixtures for a league using the full season data
// Then filter to get the most recent finished and next upcoming
async function fetchLeagueRecentAndUpcoming(leagueId, recentCount = 10, upcomingCount = 10) {
  const allFixtures = await fetchFixtures(leagueId, getSeason());
  const today = new Date();

  const finished = allFixtures
    .filter((f) => f.fixture.status.short === "FT")
    .sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date))
    .slice(0, recentCount);

  const upcoming = allFixtures
    .filter((f) => ["NS", "TBD"].includes(f.fixture.status.short))
    .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
    .slice(0, upcomingCount);

  const live = allFixtures.filter((f) =>
    ["LIVE", "1H", "2H", "HT", "ET", "P"].includes(f.fixture.status.short)
  );

  return { recent: finished, upcoming, live };
}

// Fetch today's fixtures across all leagues (uses date param - free tier friendly)
async function fetchTodayFixtures() {
  const allToday = await fetchFixturesByDate(new Date());
  const leagueIds = Object.values(LEAGUES);
  return allToday.filter((f) => leagueIds.includes(f.league.id));
}

async function fetchPlayers(leagueId, season = getSeason(), page = 1) {
  const data = await cachedApiCall("/players", {
    league: leagueId,
    season,
    page,
  });
  return data;
}

async function fetchStandings(leagueId, season = getSeason()) {
  const data = await cachedApiCall("/standings", {
    league: leagueId,
    season,
  });
  if (data.response && data.response.length > 0) {
    return data.response[0].league.standings;
  }
  return [];
}

async function fetchTopScorers(leagueId, season = getSeason()) {
  const data = await cachedApiCall("/players/topscorers", {
    league: leagueId,
    season,
  });
  return data.response || [];
}

async function fetchTopAssists(leagueId, season = getSeason()) {
  const data = await cachedApiCall("/players/topassists", {
    league: leagueId,
    season,
  });
  return data.response || [];
}

function mapApiPosition(pos) {
  const map = {
    Goalkeeper: "GK",
    Defender: "DEF",
    Midfielder: "MID",
    Attacker: "FWD",
  };
  return map[pos] || "MID";
}

function calculateFantasyPoints(stats, position) {
  let points = 0;

  if (stats.minutesPlayed >= 60) points += 2;

  const isDefender = position === "DEF" || position === "GK";
  points += stats.goals * (isDefender ? 6 : 4);
  points += stats.assists * 3;
  if (isDefender && stats.cleanSheets > 0) points += stats.cleanSheets * 4;
  points -= stats.yellowCards * 1;
  points -= stats.redCards * 3;

  return points;
}

module.exports = {
  LEAGUES,
  detectSeason,
  getSeason,
  cachedApiCall,
  fetchLeagues,
  fetchFixtures,
  fetchFixturesByDate,
  fetchLeagueRecentAndUpcoming,
  fetchTodayFixtures,
  fetchPlayers,
  fetchStandings,
  fetchTopScorers,
  fetchTopAssists,
  mapApiPosition,
  calculateFantasyPoints,
};
