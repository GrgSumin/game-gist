const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  groupCode: {
    type: String,
    required: true,
    unique: true, // Ensure unique group codes
  },
  groupName: {
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
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        // Removed `required: true` to make it optional
      },
    },
  ],
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
