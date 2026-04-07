const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDesc: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    url: { type: String, default: "" },
    source: { type: String, default: "admin" },
    isHeadline: { type: Boolean, default: false },
    category: {
      type: String,
      enum: ["transfer", "match", "injury", "general"],
      default: "general",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
