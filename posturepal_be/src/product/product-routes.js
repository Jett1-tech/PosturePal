const express = require("express");
const router = express.Router();
const productHandlers = require("./product-handlers");
const authMiddleware = require("../user/middleware/authMiddleware");
const upload = require("../multer-config");
// Các route quản lý sản phẩm chỉ dành cho admin
router.post(
  "/create-product",
  authMiddleware(["admin"]),
  upload.single("imageSrc"),
  productHandlers.createProduct
);
router.put(
  "/:id",
  authMiddleware(["admin"]),
  productHandlers.updateProduct
);
router.delete(
  "/:id",
  authMiddleware(["admin"]),
  productHandlers.deleteProduct
);
// Route upload ảnh
router.post("/upload-image", upload.single("imageSrc"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ imageUrl: `/images/${req.file.filename}` }); // Trả về URL của ảnh đã lưu
});
// Các route khác có thể không yêu cầu quyền admin
router.get("/", productHandlers.getProducts);
router.get("/:id", productHandlers.getProductById);

module.exports = router;
