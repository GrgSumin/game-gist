const News = require("../model/News");

const addNews = async (req, res) => {
  try {
    // if (!req.file) {
    //   return res.status(200).json({ message: "Please upload a valid file" });
    // }
    const { title, description, url, image, video } = req.body;

    const newNews = new News({
      title,
      description,
      url,
      // image:r,
      // video
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
    const getallNews = await News.find();
    res.json(getallNews);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { addNews, getallNews };
