const mongoose = require("mongoose");
const Group = require("../model/Group"); // Ensure correct path
const { v4: uuidv4 } = require("uuid");

// Create a new group
const createGroup = async (req, res) => {
  const { username, teamName, creatorId, groupName, teamId } = req.body;

  try {
    if (!creatorId || !groupName) {
      return res.status(400).json({
        success: false,
        error: "Creator ID and group name are required",
      });
    }

    const groupCode = uuidv4(); // Generate the unique group code

    const newGroup = new Group({
      creatorId,
      groupCode,
      groupName,
      members: [
        {
          userId: creatorId,
          username,
          teamName,
          teamId: teamId || null, // Handle the optional teamId
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

// Join a group
const joinGroup = async (req, res) => {
  const { groupCode, userId, username, teamName } = req.body;

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

    group.members.push({ userId, username, teamName });
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

// Get members of a group
const getMembers = async (req, res) => {
  try {
    const { groupCode } = req.params;

    const group = await Group.findOne({ groupCode }).populate(
      "members.userId",
      "username teamName"
    );

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    return res.status(200).json({
      success: true,
      groupName: group.groupName, // Include the group name
      members: group.members,
    });
  } catch (error) {
    console.error("Error fetching group members:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get groups by user
const getGroupsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Fetch groups where the user is a member
    const groups = await Group.find({ "members.userId": userId })
      .populate("members.userId", "username") // Populate username for each member
      .exec();

    if (!groups.length) {
      return res
        .status(404)
        .json({ success: false, message: "No groups found for the user" });
    }

    // Format the response to include the username and total points
    const groupsWithDetails = groups.map((group) => {
      return {
        groupName: group.groupName,
        groupCode: group.groupCode,
        members: group.members.map((member) => {
          // Here, we assume team details and total points logic needs to be adapted based on available schema
          // Modify this if you have team details in a different schema
          return {
            userId: member.userId._id,
            username: member.userId.username,
            teamName: member.teamName,
            // Assuming totalPoints needs to be computed if you have team details elsewhere
            totalPoints: 0, // Placeholder for total points logic
          };
        }),
      };
    });

    return res.status(200).json({ success: true, groups: groupsWithDetails });
  } catch (error) {
    console.error("Error fetching groups by user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { createGroup, joinGroup, getMembers, getGroupsByUser };
