const mongoose = require("mongoose");

const footballPlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  club: { type: String, required: true },
  price: { type: Number, required: true },
  totalpoints: { type: Number, default: 0 },
  position: { type: String, enum: ["GK", "DEF", "MID", "FWD"], required: true },
  image: { type: String }, // URL or path to the image
});

const FootballPlayer = mongoose.model("FootballPlayer", footballPlayerSchema);

module.exports = FootballPlayer;
