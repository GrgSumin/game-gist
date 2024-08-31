// controller/footballPlayer.js

const FootballPlayer = require("../model/FootballPlayer");

const createFootballPlayer = async (req, res) => {
  try {
    const { name, club, price, totalpoints, position } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPlayer = new FootballPlayer({
      name,
      club,
      price,
      totalpoints,
      position,
      image,
    });

    await newPlayer.save();

    res
      .status(200)
      .json({ message: "Football player created successfully!", newPlayer });
  } catch (error) {
    res.status(500).json({ message: "Error creating football player", error });
  }
};

const getAllFootballPlayers = async (req, res) => {
  try {
    console.log("Fetching all football players...");
    const players = await FootballPlayer.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: "Error fetching football players", error });
  }
};

// New function to fetch a player by ID
const getFootballPlayerById = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const player = await FootballPlayer.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({ success: true, player });
  } catch (error) {
    res.status(500).json({ message: "Error fetching player", error });
  }
};

module.exports = {
  createFootballPlayer,
  getAllFootballPlayers,
  getFootballPlayerById, // Export the new function
};
