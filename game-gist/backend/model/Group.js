const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    groupCode: {
      type: String,
      required: true,
      unique: true,
    },
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        fantasyTeamId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FantasyTeam",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

GroupSchema.index({ groupCode: 1 });
GroupSchema.index({ "members.userId": 1 });

module.exports = mongoose.model("Group", GroupSchema);
