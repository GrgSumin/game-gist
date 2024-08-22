const FootballPlayer = require("../model/FootballPlayer");
const path = require("path");

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
      .status(201)
      .json({ message: "Football player created successfully!", newPlayer });
  } catch (error) {
    res.status(500).json({ message: "Error creating football player", error });
  }
};

const getAllFootballPlayers = async (req, res) => {
  try {
    const players = await FootballPlayer.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ message: "Error fetching football players", error });
  }
};
module.exports = {
  createFootballPlayer,
  getAllFootballPlayers,
};
