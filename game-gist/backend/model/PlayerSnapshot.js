const mongoose = require("mongoose");

const PlayerSnapshotSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FootballPlayer",
    required: true,
  },
  gameweek: { type: Number, required: true },
  stats: {
    appearances: { type: Number, default: 0 },
    goals: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    cleanSheets: { type: Number, default: 0 },
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 },
    minutesPlayed: { type: Number, default: 0 },
  },
  gameweekPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

PlayerSnapshotSchema.index({ playerId: 1, gameweek: 1 }, { unique: true });
PlayerSnapshotSchema.index({ gameweek: 1 });

module.exports = mongoose.model("PlayerSnapshot", PlayerSnapshotSchema);
