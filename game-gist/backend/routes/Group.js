const express = require("express");
const { body } = require("express-validator");
const {
  createGroup,
  joinGroup,
  getGroupMembers,
  getGroupLeaderboard,
  getUserGroups,
} = require("../controller/group");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/create",
  auth,
  [body("groupName").trim().notEmpty().withMessage("Group name required")],
  createGroup
);

router.post(
  "/join",
  auth,
  [body("groupCode").trim().notEmpty().withMessage("Group code required")],
  joinGroup
);

router.get("/my", auth, getUserGroups);
router.get("/:groupCode/members", auth, getGroupMembers);
router.get("/:groupCode/leaderboard", auth, getGroupLeaderboard);

module.exports = router;
