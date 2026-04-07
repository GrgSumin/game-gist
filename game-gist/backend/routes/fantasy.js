const express = require("express");
const { body } = require("express-validator");
const {
  saveTeam,
  getMyTeam,
  calculateScore,
  getLeaderboard,
} = require("../controller/fantasyTeam");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/team",
  auth,
  [
    body("players")
      .isArray({ min: 11, max: 11 })
      .withMessage("Must select exactly 11 players"),
    body("players.*.playerId").notEmpty().withMessage("Player ID required"),
    body("players.*.position")
      .isIn(["GK", "DEF", "MID", "FWD"])
      .withMessage("Valid position required"),
  ],
  saveTeam
);

router.get("/team", auth, getMyTeam);
router.get("/score", auth, calculateScore);
router.get("/leaderboard", getLeaderboard);

module.exports = router;
