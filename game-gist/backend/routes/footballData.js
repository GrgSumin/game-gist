const express = require("express");
const {
  getLeagues,
  getFixtures,
  getStandings,
  getTopScorers,
  getTopAssists,
  syncPlayers,
  advanceGameweek,
  getGameweeks,
  getSyncLogs,
  getPlayerGameweekHistory,
  getDashboardFixtures,
  getLeagueFixtures,
  getPlayers,
  getPlayerById,
} = require("../controller/footballData");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/leagues", getLeagues);
router.get("/fixtures/dashboard", getDashboardFixtures);
router.get("/fixtures/browse", getLeagueFixtures);
router.get("/fixtures", getFixtures);
router.get("/standings", getStandings);
router.get("/top-scorers", getTopScorers);
router.get("/top-assists", getTopAssists);
router.get("/players", getPlayers);
router.get("/players/:id", getPlayerById);
router.get("/players/:id/history", getPlayerGameweekHistory);
router.get("/gameweeks", getGameweeks);
router.get("/sync-logs", auth, adminOnly, getSyncLogs);
router.post("/sync-players", auth, adminOnly, syncPlayers);
router.post("/advance-gameweek", auth, adminOnly, advanceGameweek);

module.exports = router;
