const News = require("../model/News");
const fs = require("fs").promises;

const addNews = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(200).json({ message: "please upload a valid file" });
    }
    const { title, description, url, image, short_desc, isHeadline } = req.body;
    console.log(req.body);
    const newNews = new News({
      title,
      description,
      url,
      image: req.file.filename,
      short_desc,
      isHeadline,
    });

    await newNews.save();
    res.status(200).json({
      message: "news added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal error",
    });
  }
};

const getallNews = async (req, res) => {
  try {
    const headlines = await News.find({ isHeadline: true });
    const getallNews = await News.find();
    const newsData = {
      headlines,
      getallNews,
    };
    res.json(newsData);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
const getANews = async (req, res) => {
  try {
    const newsId = req.params._id;
    if (!newsId) {
      return res.status(400).json({ message: "News is not defined" });
    }
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(400).json({ message: "News not found" });
    }
    return res.json(news);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { addNews, getallNews, getANews };
