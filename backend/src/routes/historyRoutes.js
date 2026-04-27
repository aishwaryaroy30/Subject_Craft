const express = require("express");
const router = express.Router();
const { getHistory, deleteSession, clearHistory, getStats } = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", getHistory);
router.get("/stats", getStats);
router.delete("/", clearHistory);
router.delete("/:id", deleteSession);

module.exports = router;