const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/userController");

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", signupUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post("/login", loginUser);

module.exports = router;
