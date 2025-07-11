const express = require("express");
const router = express.Router();
const { rateBook, getBookRatings } = require("../controllers/ratingController");
const { authMiddleware } = require("../middleware/authMiddleware");

// @route   POST /api/rating/:bookId
// @desc    Rate a book (only for logged-in users)
router.post("/:bookId", authMiddleware, rateBook);

// @route   GET /api/rating/book/:bookId
// @desc    Get all ratings for a specific book (public)
router.get("/book/:bookId", getBookRatings);

module.exports = router;
