const express = require("express");
const {
  addToCartHandler,
  getCartHandler,
  removeFromCartHandler,
  clearCartHandler
} = require("./cart-handlers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route để thêm sản phẩm vào giỏ hàng
router.post("/add",authMiddleware(), addToCartHandler);

// Route để lấy giỏ hàng của người dùng
router.get("/:userId",authMiddleware(), getCartHandler);

// Route để xóa sản phẩm khỏi giỏ hàng
router.delete("/:userId/remove", authMiddleware(), removeFromCartHandler);

// Route để xóa toàn bộ giỏ hàng của người dùng sau khi thanh toán thành công
router.delete("/:userId/clear", authMiddleware(), clearCartHandler);
module.exports = router;
