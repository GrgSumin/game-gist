const express = require("express");
const { registers } = require("../controller/User");
const router = express.Router();

router.post("/registers", registers);

module.exports = router;
