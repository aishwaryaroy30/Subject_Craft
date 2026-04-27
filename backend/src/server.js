const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const historyRoutes = require("./routes/historyRoutes");
const savedRoutes = require("./routes/savedRoutes");

const app = express();

// ── Connect Database ──────────────────────────────────────────
connectDB();

// ── Security Middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later." }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: "AI request limit reached. Wait a moment." }
});

app.use("/api/", limiter);
app.use("/api/subjects/", aiLimiter);

// ── General Middleware ────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/saved", savedRoutes);

// ── Health Check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SubjectCraft API is running", timestamp: new Date() });
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SubjectCraft API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}\n`);
});