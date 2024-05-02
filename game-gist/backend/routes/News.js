const express = require("express");
const { addNews, getallNews } = require("../controller/news");

const router = express.Router();

router.post("/addNews", addNews);
router.get("/getNews", getallNews);

module.exports = router;
