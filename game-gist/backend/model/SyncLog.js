const mongoose = require("mongoose");

const SyncLogSchema = new mongoose.Schema({
  type: { type: String, enum: ["player-sync", "gameweek-advance"], required: true },
  leagueId: { type: Number },
  leagueName: { type: String },
  trigger: { type: String, enum: ["manual", "auto"], default: "manual" },
  status: { type: String, enum: ["success", "failed"], required: true },
  totalSynced: { type: Number, default: 0 },
  pointsUpdated: { type: Number, default: 0 },
  gameweek: { type: Number },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
});

SyncLogSchema.index({ createdAt: -1 });
SyncLogSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model("SyncLog", SyncLogSchema);
