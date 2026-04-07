const News = require("../model/News");
const { validationResult } = require("express-validator");
const { fetchFootballNews, fetchTopHeadlines } = require("../services/gnews");

exports.addNews = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, shortDesc, description, url, isHeadline, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const news = await News.create({
      title,
      shortDesc,
      description,
      image,
      url,
      isHeadline: isHeadline === "true",
      category,
      source: "admin",
    });

    res.status(201).json({ news });
  } catch (err) {
    res.status(500).json({ error: "Failed to add news" });
  }
};

exports.getNews = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, source } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (source === "admin") filter.source = "admin";

    const skip = (Number(page) - 1) * Number(limit);
    const [dbArticles, total, headlines] = await Promise.all([
      News.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      News.countDocuments(filter),
      News.find({ isHeadline: true }).sort({ createdAt: -1 }).limit(5),
    ]);

    // Fetch API news and merge (only on first page, when no admin-only filter)
    let apiArticles = [];
    if (Number(page) === 1 && source !== "admin") {
      try {
        const [apiNews, apiHeadlines] = await Promise.all([
          fetchFootballNews("football premier league", 10),
          fetchTopHeadlines(5),
        ]);
        apiArticles = [...apiHeadlines, ...apiNews].map((a) => ({
          _id: `api-${Buffer.from(a.url || a.title).toString("base64").slice(0, 20)}`,
          title: a.title,
          shortDesc: a.shortDesc,
          description: a.description,
          image: a.image,
          url: a.url,
          source: a.source || "External",
          isHeadline: false,
          category: "general",
          createdAt: a.publishedAt || new Date().toISOString(),
        }));
      } catch {
        // API news fetch failed, continue with admin news only
      }
    }

    // Merge: admin headlines first, then interleave admin + API articles by date
    const allArticles = [...dbArticles.map((a) => a.toObject()), ...apiArticles];
    allArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Use admin headlines if available, otherwise pick from API
    const allHeadlines = headlines.length > 0
      ? headlines
      : apiArticles.filter((a) => a.image).slice(0, 3);

    res.json({
      articles: allArticles,
      headlines: allHeadlines,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total + apiArticles.length,
        pages: Math.ceil((total + apiArticles.length) / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

// Dedicated endpoint for API-only news
exports.getApiNews = async (req, res) => {
  try {
    const { q = "football soccer", max = 10 } = req.query;
    const articles = await fetchFootballNews(q, Number(max));
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch external news" });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    // Check if it's an API article ID (starts with "api-")
    if (req.params.id.startsWith("api-")) {
      return res.status(404).json({ error: "External articles open in their original source" });
    }

    const article = await News.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json({ article });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch article" });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete article" });
  }
};
