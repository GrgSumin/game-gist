// routes/Group.js
const express = require("express");
const { createGroup, joinGroup, getMembers } = require("../controller/Group");
const router = express.Router();

router.post("/create", createGroup);
router.post("/join", joinGroup);
router.get("/:groupCode/members", getMembers);

module.exports = router;
