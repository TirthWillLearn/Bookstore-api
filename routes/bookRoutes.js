const express = require("express");
const {
  getBook,
  addBook,
  addBookCover,
  getBooksWithPagination,
  getBookById,
} = require("../controllers/bookController");
const { authMiddleware, checkRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { body } = require("express-validator");

const router = express.Router();

// @route   GET /api/book/get
// @desc    Get books (only for authenticated users)
router.get(
  "/get",
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("author").trim().notEmpty().withMessage("Author is required"),
  ],
  authMiddleware,
  getBook
);

// @route   GET /api/book
// @desc    Get paginated & filtered book list (public)
router.get("/", getBooksWithPagination);

// @route   POST /api/book/add
// @desc    Add new book (admin only)
router.post("/add", authMiddleware, checkRole("admin"), addBook);

// @route   POST /api/book/upload
// @desc    Upload book cover image (authenticated)
router.post("/upload", authMiddleware, upload.single("cover"), addBookCover);

// GET /api/book/:id
// Returns the details of a book by its ID.
// Response:
//   200: JSON object with book details
//   404: { message: "Book not found" } if no book matches the given ID
router.get("/:id", getBookById);

module.exports = router;
