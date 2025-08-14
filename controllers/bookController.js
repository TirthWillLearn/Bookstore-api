const db = require("../config/db.js");
const { validationResult } = require("express-validator");

// @route   GET /api/book/get
// @desc    Get all books (no pagination)
exports.getBook = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM books");
    res.status(200).json({ books: rows });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/book/
// @desc    Get books with pagination & optional filters
exports.getBooksWithPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const author = req.query.author || "";
    const title = req.query.title || "";

    const offset = (page - 1) * limit;

    const sql = `
      SELECT * FROM books
      WHERE author LIKE ? AND title LIKE ?
      LIMIT ? OFFSET ?
    `;

    const [books] = await db.query(sql, [
      `%${author}%`,
      `%${title}%`,
      limit,
      offset,
    ]);

    res.json({
      page,
      limit,
      count: books.length,
      books,
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/book/upload
// @desc    Upload book cover image
exports.addBookCover = async (req, res, next) => {
  if (!req.file) {
    const error = new Error("No file uploaded");
    error.statusCode = 400;
    return next(error);
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
};

// @route   POST /api/book/add
// @desc    Add a new book (only admin)
exports.addBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, author, description } = req.body;
  const userId = req.user.id;

  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required" });
  }

  try {
    const [results] = await db.query(
      "INSERT INTO books (title, author, description, user_id) VALUES (?, ?, ?, ?)",
      [title, author, description || null, userId]
    );

    res.status(201).json({
      message: "Book added successfully",
      book: {
        id: results.insertId,
        title,
        author,
        description: description || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/book/:id
// @desc    Get a single book by its ID
// @access  Public
exports.getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);

    if (rows.length === 0) {
      // If no book exists with the given ID, return a 404 Not Found response
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
};
