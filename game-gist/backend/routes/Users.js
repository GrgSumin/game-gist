const express = require("express");
const { registers, login } = require("../controller/User");
const router = express.Router();

router.post("/registers", registers);
router.post("/login", login);

module.exports = router;
