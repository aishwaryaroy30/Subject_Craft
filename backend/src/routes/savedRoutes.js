const express = require("express");
const router = express.Router();
const { getSaved, saveOne, updateSaved, deleteSaved } = require("../controllers/savedController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", getSaved);
router.post("/", saveOne);
router.put("/:id", updateSaved);
router.delete("/:id", deleteSaved);

module.exports = router;