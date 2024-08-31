const Team = require("../model/Team");
const FootballPlayer = require("../model/FootballPlayer");

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, players } = req.body;

    // Validate players
    const foundPlayers = await FootballPlayer.find({ _id: { $in: players } });
    if (foundPlayers.length !== players.length) {
      return res.status(400).json({ message: "Some players were not found" });
    }

    const newTeam = new Team({ name, players });
    await newTeam.save();

    res.status(201).json({ message: "Team created successfully!", newTeam });
  } catch (error) {
    res.status(500).json({ message: "Error creating team", error });
  }
};

// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("players");
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error });
  }
};

// Simulate a match between two teams
const simulateMatch = async (req, res) => {
  try {
    const { teamAId, teamBId } = req.body;

    const teamA = await Team.findById(teamAId).populate("players");
    const teamB = await Team.findById(teamBId).populate("players");

    if (!teamA || !teamB) {
      return res.status(404).json({ message: "One or both teams not found" });
    }

    // Set all players to start with 1 point
    teamA.players.forEach((player) => {
      player.totalpoints = 1;
    });
    teamB.players.forEach((player) => {
      player.totalpoints = 1;
    });

    // Save the initial points to the database
    await Promise.all(
      [...teamA.players, ...teamB.players].map((player) => player.save())
    );

    // Randomly select a scorer and an assister from each team
    const randomPlayerA =
      teamA.players[Math.floor(Math.random() * teamA.players.length)];
    const randomPlayerB =
      teamB.players[Math.floor(Math.random() * teamB.players.length)];
    const randomPlayerAssist =
      teamA.players[Math.floor(Math.random() * teamA.players.length)];

    // Simulate scoring
    randomPlayerA.totalpoints += 10; // Player A scores
    randomPlayerAssist.totalpoints += 5; // Player A assists

    await randomPlayerA.save();
    await randomPlayerAssist.save();
    await randomPlayerB.save();

    res.status(200).json({
      message: "Match simulated successfully!",
      result: {
        score: "Randomly simulated score",
        playerA: randomPlayerA.name,
        playerB: randomPlayerB.name,
        playerAssist: randomPlayerAssist.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error simulating match", error });
  }
};

// Reset all player points to 1
const resetPlayerPoints = async (req, res) => {
  try {
    const teams = await Team.find().populate("players");

    for (const team of teams) {
      for (const player of team.players) {
        player.totalpoints = 0; // Reset points to 1
        await player.save();
      }
    }

    res
      .status(200)
      .json({ message: "All player points have been reset to 1." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting player points", error });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  simulateMatch,
  resetPlayerPoints,
};
