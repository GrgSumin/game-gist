const express = require("express");
const {
  saveSelectedPlayers,
  getSelectedPlayers,
} = require("../controller/playerController");
const router = express.Router();

router.post("/save", saveSelectedPlayers);
router.get("/:userId", getSelectedPlayers);

module.exports = router;
