const FantasyTeam = require("../model/FantasyTeam");
const FootballPlayer = require("../model/FootballPlayer");
const { calculateFantasyPoints } = require("../services/apiFootball");
const { validationResult } = require("express-validator");

exports.saveTeam = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { name, formation, players } = req.body;

    if (!players || players.length !== 11) {
      return res.status(400).json({ error: "Must select exactly 11 players" });
    }

    const playerIds = players.map((p) => p.playerId);
    const dbPlayers = await FootballPlayer.find({ _id: { $in: playerIds } });

    if (dbPlayers.length !== 11) {
      return res.status(400).json({ error: "Some players not found" });
    }

    const totalCost = dbPlayers.reduce((sum, p) => sum + p.price, 0);
    if (totalCost > 100) {
      return res
        .status(400)
        .json({ error: `Budget exceeded: ${totalCost.toFixed(1)}/100.0` });
    }

    const captainCount = players.filter((p) => p.isCaptain).length;
    if (captainCount !== 1) {
      return res.status(400).json({ error: "Must have exactly 1 captain" });
    }

    let team = await FantasyTeam.findOne({ userId });

    if (team) {
      team.name = name || team.name;
      team.formation = formation || team.formation;
      team.players = players;
      team.budget = 100 - totalCost;
      await team.save();
    } else {
      team = await FantasyTeam.create({
        userId,
        name: name || "My Team",
        formation: formation || "4-3-3",
        players,
        budget: 100 - totalCost,
      });
    }

    await team.populate("players.playerId");
    res.json({ team });
  } catch (err) {
    res.status(500).json({ error: "Failed to save team" });
  }
};

exports.getMyTeam = async (req, res) => {
  try {
    const team = await FantasyTeam.findOne({ userId: req.user.id }).populate(
      "players.playerId"
    );

    if (!team) {
      return res.json({ team: null });
    }

    res.json({ team });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
};

exports.calculateScore = async (req, res) => {
  try {
    const team = await FantasyTeam.findOne({ userId: req.user.id }).populate(
      "players.playerId"
    );

    if (!team) {
      return res.status(404).json({ error: "No team found" });
    }

    let totalPoints = 0;
    const playerScores = [];

    for (const slot of team.players) {
      const player = slot.playerId;
      if (!player) continue;

      let points = calculateFantasyPoints(player.stats, player.position);
      if (slot.isCaptain) points *= 2;

      playerScores.push({
        playerId: player._id,
        name: player.name,
        position: player.position,
        club: player.club,
        photo: player.photo,
        points,
        isCaptain: slot.isCaptain,
        isViceCaptain: slot.isViceCaptain,
        stats: player.stats,
      });

      totalPoints += points;
    }

    team.totalPoints = totalPoints;
    team.gameweekPoints = totalPoints;
    await team.save();

    res.json({ totalPoints, playerScores });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate score" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const teams = await FantasyTeam.find()
      .populate("userId", "username avatar")
      .sort({ totalPoints: -1 })
      .limit(100);

    const leaderboard = teams.map((team, index) => ({
      rank: index + 1,
      teamName: team.name,
      username: team.userId?.username || "Unknown",
      avatar: team.userId?.avatar || "",
      totalPoints: team.totalPoints,
      gameweekPoints: team.gameweekPoints,
    }));

    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
