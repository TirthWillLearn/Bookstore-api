const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const db = require("./config/db.js");

const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");
const ratingRoutes = require("./routes/ratingRoute");
const aiRoutes = require("./experimental_features/aiRoute.js");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    service: "BookStore REST API",
    status: "running",
    environment: process.env.NODE_ENV || "development",
    description:
      "Backend API for managing books, users, ratings with authentication and role-based access",

    auth: {
      register: {
        method: "POST",
        path: "/api/auth/register",
        description: "Register a new user (role defaults to user)",
      },
      login: {
        method: "POST",
        path: "/api/auth/login",
        description: "Login and receive JWT token",
      },
    },

    books: {
      list: {
        method: "GET",
        path: "/api/book",
        access: "Public",
        query: ["search", "category", "page", "limit"],
      },
      getById: {
        method: "GET",
        path: "/api/book/:id",
        access: "Public",
      },
      getValidated: {
        method: "GET",
        path: "/api/book/get",
        access: "Authenticated",
      },
      add: {
        method: "POST",
        path: "/api/book/add",
        access: "Admin only",
      },
      uploadCover: {
        method: "POST",
        path: "/api/book/upload",
        access: "Authenticated",
      },
    },

    ratings: {
      add: {
        method: "POST",
        path: "/api/rating/:bookId",
        access: "Authenticated",
      },
      list: {
        method: "GET",
        path: "/api/rating/book/:bookId",
        access: "Public",
      },
    },

    meta: {
      health: "/health",
      documentation: "See README.md on GitHub",
    },
  });
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  error.details = {
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    headers: req.headers,
  };
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({
    error: message,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.DB_PORT || 5000;

(async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Database reachable");
  } catch (err) {
    console.error("❌ Database not reachable:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
})();
