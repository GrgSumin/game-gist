const mongoose = require("mongoose");

const GameweekSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    label: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GameweekSchema.index({ number: 1 }, { unique: true });

module.exports = mongoose.model("Gameweek", GameweekSchema);
