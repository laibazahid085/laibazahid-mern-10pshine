// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
