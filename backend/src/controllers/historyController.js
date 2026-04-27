const GenerationSession = require("../models/GenerationSession");

// @GET /api/history
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
      GenerationSession.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      GenerationSession.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      sessions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history." });
  }
};

// @DELETE /api/history/:id
const deleteSession = async (req, res) => {
  try {
    const session = await GenerationSession.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ error: "Session not found." });
    res.json({ message: "Session deleted." });
  } catch (error) {
    res.status(500).json({ error: "Delete failed." });
  }
};

// @DELETE /api/history
const clearHistory = async (req, res) => {
  try {
    await GenerationSession.deleteMany({ user: req.user._id });
    res.json({ message: "History cleared." });
  } catch (error) {
    res.status(500).json({ error: "Clear failed." });
  }
};

// @GET /api/history/stats
const getStats = async (req, res) => {
  try {
    const sessions = await GenerationSession.find({ user: req.user._id });
    const totalGenerated = sessions.reduce((sum, s) => sum + s.totalGenerated, 0);
    const allResults = sessions.flatMap(s => s.results);
    const avgOpenRate = allResults.length
      ? (allResults.reduce((s, r) => s + r.openRate, 0) / allResults.length).toFixed(1)
      : 0;

    // tone frequency
    const toneCount = {};
    sessions.forEach(s => s.tones.forEach(t => { toneCount[t] = (toneCount[t] || 0) + 1; }));
    const topTone = Object.entries(toneCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    // weekly activity (last 7 days)
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const weeklyData = days.map((day, i) => {
      const count = sessions.filter(s => new Date(s.createdAt).getDay() === i).length;
      return { day, count };
    });

    res.json({ totalGenerated, totalSessions: sessions.length, avgOpenRate, topTone, weeklyData });
  } catch (error) {
    res.status(500).json({ error: "Stats failed." });
  }
};

module.exports = { getHistory, deleteSession, clearHistory, getStats };