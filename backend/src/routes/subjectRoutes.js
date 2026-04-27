const express = require("express");
const router = express.Router();
const { generate, refine, abTest } = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // all subject routes require auth

router.post("/generate", generate);
router.post("/refine", refine);
router.post("/ab-test", abTest);

module.exports = router;