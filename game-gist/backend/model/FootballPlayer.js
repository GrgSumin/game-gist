const mongoose = require("mongoose");

const footballPlayerSchema = new mongoose.Schema(
  {
    apiId: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true },
    firstname: { type: String, default: "" },
    lastname: { type: String, default: "" },
    age: { type: Number },
    nationality: { type: String, default: "" },
    photo: { type: String, default: "" },
    club: { type: String, required: true },
    clubLogo: { type: String, default: "" },
    league: { type: String, default: "Premier League" },
    leagueId: { type: Number, default: 39 },
    position: {
      type: String,
      enum: ["GK", "DEF", "MID", "FWD"],
      required: true,
    },
    price: { type: Number, required: true, default: 5.0 },
    totalPoints: { type: Number, default: 0 },
    stats: {
      appearances: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
      minutesPlayed: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

footballPlayerSchema.index({ leagueId: 1, position: 1 });
footballPlayerSchema.index({ club: 1 });

module.exports = mongoose.model("FootballPlayer", footballPlayerSchema);
