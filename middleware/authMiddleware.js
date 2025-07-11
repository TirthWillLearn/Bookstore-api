const jwt = require("jsonwebtoken");

// Middleware to verify JWT token from Authorization header
exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      const error = new Error("No Token Provided");
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach decoded user info (id, role) to request
    next();
  } catch (err) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    next(error);
  }
};

// Middleware to check for required user role (e.g., admin)
exports.checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (req.user.role !== requiredRole) {
        const error = new Error("Access denied (insufficient role)");
        error.statusCode = 403;
        return next(error);
      }
      next();
    } catch (err) {
      const error = new Error("Server error during role check");
      error.statusCode = 500;
      next(error);
    }
  };
};
