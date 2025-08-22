const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// @route   POST /api/auth/register
// @desc    Register a new user
exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Inputs arrive already trimmed/lowercased from the route
  const { name, email, password } = req.body;
  // SECURITY: force role to "user" for public registration
  const roleToSave = "user";

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [insertResult] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, roleToSave]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: insertResult.insertId,
        name,
        email,
        role: roleToSave,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT
exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email; // already trimmed/lowercased in route
  const password = req.body.password;

  try {
    const [results] = await db.query(
      "SELECT id, name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    // Avoid user enumeration
    if (results.length === 0) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "Login successful",
      token_type: "Bearer",
      expires_in: 30 * 24 * 60 * 60, // seconds
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    return next(err);
  }
};
