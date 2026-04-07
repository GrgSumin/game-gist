const mongoose = require("mongoose");

const fantasyTeamSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    formation: {
      type: String,
      default: "4-3-3",
      enum: ["4-3-3", "4-4-2", "3-5-2", "3-4-3", "5-3-2", "5-4-1"],
    },
    players: [
      {
        playerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FootballPlayer",
          required: true,
        },
        position: {
          type: String,
          enum: ["GK", "DEF", "MID", "FWD"],
          required: true,
        },
        isCaptain: { type: Boolean, default: false },
        isViceCaptain: { type: Boolean, default: false },
      },
    ],
    totalPoints: { type: Number, default: 0 },
    gameweekPoints: { type: Number, default: 0 },
    budget: { type: Number, default: 100.0 },
  },
  { timestamps: true }
);

fantasyTeamSchema.index({ userId: 1 });

module.exports = mongoose.model("FantasyTeam", fantasyTeamSchema);
