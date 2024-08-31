const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  selectedPlayers: [
    {
      id: { type: String, required: true },
      name: String,
      club: String,
      price: Number,
      position: String,
      totalpoints: Number,
      image: String, // Add image field
    },
  ],
});

module.exports = mongoose.model("Player", playerSchema);
