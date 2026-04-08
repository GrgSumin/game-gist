const axios = require("axios");
const ApiCache = require("../model/ApiCache");

const BASE_URL = "https://v3.football.api-sports.io";

const LEAGUES = {
  EPL: 39,
  UCL: 2,
  BUNDESLIGA: 78,
};

const CURRENT_SEASON = 2024;

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

async function fetchFixtures(leagueId, season = CURRENT_SEASON) {
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
  const allFixtures = await fetchFixtures(leagueId, CURRENT_SEASON);
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

async function fetchPlayers(leagueId, season = CURRENT_SEASON, page = 1) {
  const data = await cachedApiCall("/players", {
    league: leagueId,
    season,
    page,
  });
  return data;
}

async function fetchStandings(leagueId, season = CURRENT_SEASON) {
  const data = await cachedApiCall("/standings", {
    league: leagueId,
    season,
  });
  if (data.response && data.response.length > 0) {
    return data.response[0].league.standings;
  }
  return [];
}

async function fetchTopScorers(leagueId, season = CURRENT_SEASON) {
  const data = await cachedApiCall("/players/topscorers", {
    league: leagueId,
    season,
  });
  return data.response || [];
}

async function fetchTopAssists(leagueId, season = CURRENT_SEASON) {
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
  CURRENT_SEASON,
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
