// controllers/playerController.js
const Player = require("../model/Player");
const FootballPlayer = require("../model/FootballPlayer");

saveSelectedPlayers = async (req, res) => {
  const { userId, selectedPlayers } = req.body;

  try {
    // Fetch points for each player
    const playersWithPoints = await Promise.all(
      selectedPlayers.map(async (player) => {
        const footballPlayer = await FootballPlayer.findOne({ id: player.id });
        if (footballPlayer) {
          return {
            ...player,
            totalpoints: footballPlayer.totalpoints,
          };
        }
        return player;
      })
    );

    const existingRecord = await Player.findOne({ userId });

    if (existingRecord) {
      existingRecord.selectedPlayers = playersWithPoints;
      await existingRecord.save();
    } else {
      const newRecord = new Player({
        userId,
        selectedPlayers: playersWithPoints,
      });
      await newRecord.save();
    }

    res.status(200).json({ message: "Players saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save players" });
  }
};

getSelectedPlayers = async (req, res) => {
  const { userId } = req.query;

  try {
    const record = await Player.findOne({ userId });

    if (record) {
      res.status(200).json(record.selectedPlayers);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
};
module.exports = { saveSelectedPlayers, getSelectedPlayers };
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
const express = require("express");
const {
  saveSelectedPlayers,
  getSelectedPlayers,
} = require("../controller/playerController");
const router = express.Router();

router.post("/saveSelectedPlayers", saveSelectedPlayers);
router.get("/getSelectedPlayers", getSelectedPlayers);

module.exports = router;
