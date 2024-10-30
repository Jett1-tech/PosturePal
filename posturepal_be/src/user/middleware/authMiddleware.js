const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Middleware để xác thực JWT và kiểm tra vai trò
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);    
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Lưu thông tin user từ token vào request

      if (roles.length && !roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({
            message:
              "Access denied. You do not have permission to perform this action.",
          });
      }

      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid token." });
    }
  };
};

module.exports = authMiddleware;
