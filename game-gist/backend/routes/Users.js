const express = require("express");
const { registers, login } = require("../controller/User");
const router = express.Router();

router.post("/register", registers); // Changed endpoint to /register for consistency
router.post("/login", login);

module.exports = router;
