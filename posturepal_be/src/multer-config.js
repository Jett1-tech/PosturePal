// src/multer-config.js
const multer = require("multer");
const path = require("path");

// Cấu hình lưu trữ cho Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Lưu file vào thư mục public/images
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    // Đặt tên file theo timestamp + đuôi file
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Middleware Multer để xử lý upload file
const upload = multer({ storage: storage });

module.exports = upload;
