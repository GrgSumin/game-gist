const News = require("../model/News");
const { validationResult } = require("express-validator");

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
    });

    res.status(201).json({ news });
  } catch (err) {
    res.status(500).json({ error: "Failed to add news" });
  }
};

exports.getNews = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [articles, total, headlines] = await Promise.all([
      News.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      News.countDocuments(filter),
      News.find({ isHeadline: true }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      articles,
      headlines,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
};

exports.getNewsById = async (req, res) => {
  try {
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
