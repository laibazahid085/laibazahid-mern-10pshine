const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup Controller
exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    req.log.info(`Signup attempt: ${email}`);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.log.warn(`Signup failed - user exists: ${email}`);
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    req.log.info(`User signed up: ${email}`);

    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    req.log.error(`Signup error for ${email}: ${error.message}`);
    res.status(500).json({ message: "Signup failed." });
  }
};

// Login Controller
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    req.log.info(`Login attempt: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      req.log.warn(`Login failed - no user found: ${email}`);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.log.warn(`Login failed - wrong password: ${email}`);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    req.log.info(`User logged in: ${email}`);

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    req.log.error(`Login error for ${email}: ${error.message}`);
    res.status(500).json({ message: "Login failed." });
  }
};

// Get Profile Controller
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      req.log.warn(`Profile not found for user ID: ${req.user.id}`);
      return res.status(404).json({ message: "User not found." });
    }

    req.log.info(`Profile fetched for user ID: ${req.user.id}`);
    res.status(200).json(user);
  } catch (error) {
    req.log.error(`Error fetching profile: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};
