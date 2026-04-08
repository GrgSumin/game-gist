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

async function fetchRecentFixtures(leagueId, count = 10) {
  const data = await cachedApiCall("/fixtures", {
    league: leagueId,
    season: CURRENT_SEASON,
    last: count,
  });
  return data.response || [];
}

async function fetchUpcomingFixtures(leagueId, count = 10) {
  const data = await cachedApiCall("/fixtures", {
    league: leagueId,
    season: CURRENT_SEASON,
    next: count,
  });
  return data.response || [];
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
  fetchRecentFixtures,
  fetchUpcomingFixtures,
  fetchPlayers,
  fetchStandings,
  fetchTopScorers,
  fetchTopAssists,
  mapApiPosition,
  calculateFantasyPoints,
};
