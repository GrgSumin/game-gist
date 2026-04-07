const express = require("express");
const { body } = require("express-validator");
const { register, login, getProfile, getAllUsers } = require("../controller/User");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("username")
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  login
);

router.get("/profile", auth, getProfile);
router.get("/all", auth, adminOnly, getAllUsers);

module.exports = router;
