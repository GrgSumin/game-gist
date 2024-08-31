const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "FootballPlayer" }], // Reference to FootballPlayer model
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
