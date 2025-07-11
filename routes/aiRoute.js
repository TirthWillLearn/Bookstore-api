const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { generateSummary } = require("../controllers/aiController");

// Route to generate book summary using AI
router.post("/summary", authMiddleware, generateSummary);

module.exports = router;
