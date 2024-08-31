const express = require("express");
const {
  createGroup,
  joinGroup,
  getMembers,
  getGroupsByUser,
} = require("../controller/Group");
const router = express.Router();

router.post("/create", createGroup);
router.post("/join", joinGroup);
router.get("/:groupCode/members", getMembers);
router.get("/user/:userId", getGroupsByUser); // Add this route

module.exports = router;
