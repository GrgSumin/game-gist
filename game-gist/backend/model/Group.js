const mongoose = require("mongoose");
const User = require("../model/User"); // Ensure correct path

const GroupSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  groupCode: {
    type: String,
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      username: String,
      teamName: String,
      totalPoints: Number,
    },
  ],
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;