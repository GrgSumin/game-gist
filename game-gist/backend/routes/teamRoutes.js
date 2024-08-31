const express = require("express");
const {
  createTeam,
  getAllTeams,
  simulateMatch,
  resetPlayerPoints,
} = require("../controller/teamController");

const router = express.Router();

// Routes
router.post("/create", createTeam);
router.get("/teams", getAllTeams);
router.post("/simulate", simulateMatch);
router.post("/reset", resetPlayerPoints);

module.exports = router;
