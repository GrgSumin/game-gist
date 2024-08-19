const express = require("express");
const { addNews, getallNews, getANews } = require("../controller/news");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
});

const fileFIilter = (req, file, cb) => {
  const allowedfileTypes = /jpeg|jpg|png/;
  const extname = allowedfileTypes.test(file.originalname.toLoweCase());
  const mimetype = allowedfileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("invalid file type", false));
  }
};

router.post("/addNews", upload.single("image"), addNews);
router.get("/getNews", getallNews);
router.get("/getANews/:_id", getANews);

module.exports = router;
