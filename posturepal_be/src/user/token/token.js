const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Hàm tạo JWT
const generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    role: user.userRole,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

// Xác minh JWT
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
