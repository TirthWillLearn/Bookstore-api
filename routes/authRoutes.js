// routes/authRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Per-route limiters (recommended)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 signups per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registrations from this IP. Try later.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 logins/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

// POST /api/auth/register (public; always creates user)
router.post(
  "/register",
  registerLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Invalid email"),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage(
        "Password must be at least 8 characters and include a number"
      ),
    // Note: no 'role' accepted here on purpose
  ],
  registerUser
);

// POST /api/auth/login (public)
router.post(
  "/login",
  loginLimiter,
  [
    body("email")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

module.exports = router;
