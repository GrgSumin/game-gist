const Group = require("../model/Group");
const { v4: uuidv4 } = require("uuid");
const User = require("../model/User");

const createGroup = async (req, res) => {
  const { username, teamName, totalPoints, creatorId } = req.body;

  try {
    if (!creatorId) {
      return res.status(400).json({
        success: false,
        error: "Creator ID is required",
      });
    }

    const groupCode = uuidv4(); // Generate the unique group code

    const newGroup = new Group({
      creatorId,
      groupCode, // Include the group code
      members: [
        {
          userId: creatorId,
          username,
          teamName,
          totalPoints,
        },
      ],
    });

    await newGroup.save();

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: newGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
const joinGroup = async (req, res) => {
  const { groupCode, userId, username, teamName, totalPoints } = req.body;

  try {
    let group = await Group.findOne({ groupCode });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const isMember = group.members.some((member) =>
      member.userId.equals(userId)
    );

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of the group",
      });
    }

    group.members.push({ userId, username, teamName, totalPoints });
    await group.save();

    res.json({
      success: true,
      message: "Joined group successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMembers = async (req, res) => {
  try {
    const { groupCode } = req.params;

    // Find the group by groupCode and populate the members array
    const group = await Group.findOne({ groupCode }).populate(
      "members.userId",
      "username teamName totalPoints"
    );

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    return res.status(200).json({
      success: true,
      members: group.members,
    });
  } catch (error) {
    console.error("Error fetching group members:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getMembers,
};

module.exports = { createGroup, joinGroup, getMembers };
