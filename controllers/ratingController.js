const db = require("../config/db");

// @route   POST /api/rating/:bookId
// @desc    Rate or update a book rating
exports.rateBook = async (req, res, next) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    const error = new Error("Rating must be between 1 and 5");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM ratings WHERE user_id = ? AND book_id = ?",
      [userId, bookId]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND book_id = ?",
        [rating, userId, bookId]
      );
      return res.status(200).json({ message: "You updated your rating!" });
    }

    await db.query(
      "INSERT INTO ratings (user_id, book_id, rating) VALUES (?, ?, ?)",
      [userId, bookId, rating]
    );

    res.status(201).json({ message: "Thanks for rating this book!" });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/rating/book/:bookId
// @desc    Get all ratings for a book with usernames
exports.getBookRatings = async (req, res, next) => {
  const bookId = req.params.bookId;

  try {
    const [rows] = await db.query(
      `SELECT u.name, r.rating, r.created_at
       FROM ratings AS r
       JOIN users AS u ON r.user_id = u.id
       WHERE r.book_id = ?`,
      [bookId]
    );

    res.status(200).json({ ratings: rows });
  } catch (err) {
    next(err);
  }
};
