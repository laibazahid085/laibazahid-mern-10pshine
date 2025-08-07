const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", signup);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post("/login", login);

module.exports = router;
