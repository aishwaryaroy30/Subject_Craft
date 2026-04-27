const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Generate JWT ──────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ── @POST /api/auth/register ──────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("REGISTER BODY:", { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: role || "member",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(". ") });
    }
    res.status(500).json({ error: "Registration failed. Try again." });
  }
};

// ── @POST /api/auth/login ─────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", { email });

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // select password explicitly since it's hidden by default
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account has been deactivated." });
    }

    const isPasswordValid = await user.comparePassword(password);
    console.log("PASSWORD MATCH:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // update last login safely
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
    });

    const token = generateToken(user._id);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: new Date(),
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Login failed. Try again." });
  }
};

// ── @GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// ── @PUT /api/auth/profile ────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Profile updated.",
      user,
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({ error: "Profile update failed." });
  }
};

module.exports = { register, login, getMe, updateProfile };