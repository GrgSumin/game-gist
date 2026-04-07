const axios = require("axios");
const ApiCache = require("../model/ApiCache");

const GNEWS_BASE = "https://gnews.io/api/v4";

async function fetchFootballNews(query = "football soccer", max = 10) {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey || apiKey === "your-gnews-api-key") {
    return [];
  }

  const cacheKey = `gnews:${query}:${max}`;
  const cached = await ApiCache.findOne({ key: cacheKey });
  if (cached) {
    return cached.data;
  }

  const response = await axios.get(`${GNEWS_BASE}/search`, {
    params: {
      q: query,
      lang: "en",
      max,
      token: apiKey,
    },
  });

  const articles = (response.data.articles || []).map((a) => ({
    title: a.title,
    shortDesc: a.description || "",
    description: a.content || a.description || "",
    image: a.image || "",
    url: a.url || "",
    source: a.source?.name || "External",
    publishedAt: a.publishedAt,
  }));

  await ApiCache.findOneAndUpdate(
    { key: cacheKey },
    { key: cacheKey, data: articles, createdAt: new Date() },
    { upsert: true }
  );

  return articles;
}

async function fetchTopHeadlines(max = 5) {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey || apiKey === "your-gnews-api-key") {
    return [];
  }

  const cacheKey = `gnews:headlines:sports:${max}`;
  const cached = await ApiCache.findOne({ key: cacheKey });
  if (cached) {
    return cached.data;
  }

  const response = await axios.get(`${GNEWS_BASE}/top-headlines`, {
    params: {
      topic: "sports",
      lang: "en",
      max,
      token: apiKey,
    },
  });

  const articles = (response.data.articles || []).map((a) => ({
    title: a.title,
    shortDesc: a.description || "",
    description: a.content || a.description || "",
    image: a.image || "",
    url: a.url || "",
    source: a.source?.name || "External",
    publishedAt: a.publishedAt,
  }));

  await ApiCache.findOneAndUpdate(
    { key: cacheKey },
    { key: cacheKey, data: articles, createdAt: new Date() },
    { upsert: true }
  );

  return articles;
}

module.exports = { fetchFootballNews, fetchTopHeadlines };
