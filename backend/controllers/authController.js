const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Password strength checker
const isStrongPassword = (password) => {
  const strongRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return strongRegex.test(password);
};

// Register a new user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    req.log.info(`Signup attempt: ${email}`);

    // ✅ Validate password strength
    if (!isStrongPassword(password)) {
      req.log.warn(`Weak password attempt by ${email}`);
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include a letter, a number, and a special character (!@#$%^&*).",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.log.warn(`Signup failed - user already exists: ${email}`);
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    req.log.info(`User signed up successfully: ${email}`);

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

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    req.log.info(`Login attempt: ${email}`);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      req.log.warn(`Login failed - user not found: ${email}`);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.log.warn(`Login failed - wrong password: ${email}`);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    req.log.info(`User logged in successfully: ${email}`);

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
