const Group = require("../model/Group");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

exports.createGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { groupName } = req.body;

    const groupCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const group = await Group.create({
      creatorId: userId,
      groupCode,
      groupName,
      members: [{ userId }],
    });

    res.status(201).json({ group });
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { groupCode } = req.body;

    const group = await Group.findOne({ groupCode });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isMember = group.members.some(
      (m) => m.userId.toString() === userId
    );
    if (isMember) {
      return res.status(409).json({ error: "Already a member of this group" });
    }

    group.members.push({ userId });
    await group.save();

    res.json({ group });
  } catch (err) {
    res.status(500).json({ error: "Failed to join group" });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findOne({
      groupCode: req.params.groupCode,
    })
      .populate("members.userId", "username avatar")
      .populate("members.fantasyTeamId");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ group });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch group members" });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({ "members.userId": userId })
      .populate("members.userId", "username avatar")
      .populate("creatorId", "username");

    res.json({ groups });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};
