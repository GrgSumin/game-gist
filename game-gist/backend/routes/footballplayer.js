// routes/footballPlayerRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createFootballPlayer,
  getAllFootballPlayers,
} = require("../controller/footballPlayer");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the current timestamp to the original file name
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/create", upload.single("image"), createFootballPlayer);
router.get("/players", getAllFootballPlayers);

module.exports = router;
