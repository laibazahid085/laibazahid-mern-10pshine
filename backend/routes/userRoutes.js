const express = require("express");
const router = express.Router();
const { signupUser, loginUser, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   POST /api/users/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", signupUser);

/**
 * @route   POST /api/users/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
