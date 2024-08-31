// controllers/playerController.js
const Player = require("../model/Player");
const FootballPlayer = require("../model/FootballPlayer");

const saveSelectedPlayers = async (req, res) => {
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

const getSelectedPlayers = async (req, res) => {
  const { userId } = req.params;

  try {
    const record = await Player.findOne({ userId });

    if (record) {
      // Update the points, names, and images in selected players before returning
      const updatedPlayers = await Promise.all(
        record.selectedPlayers.map(async (player) => {
          const footballPlayer = await FootballPlayer.findById(player.id);
          return {
            ...player,
            name: footballPlayer ? footballPlayer.name : player.name,
            image: footballPlayer ? footballPlayer.image : player.image,
            totalpoints: footballPlayer
              ? footballPlayer.totalpoints
              : player.totalpoints,
          };
        })
      );

      res.status(200).json(updatedPlayers);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

module.exports = { saveSelectedPlayers, getSelectedPlayers };
