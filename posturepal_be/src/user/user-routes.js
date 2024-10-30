const express = require("express");
const {
  signupHandler,
  loginHandler,
  logoutHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} = require("./user-handlers");
const authMiddleware = require("./middleware/authMiddleware");
const router = express.Router();

// Đăng ký, đăng nhập, đăng xuất
router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);

// Các route dành cho admin
router.get("/", authMiddleware(["admin"]), getAllUsersHandler);
router.get("/:id", authMiddleware(["admin"]), getUserByIdHandler);
router.put("/:id", authMiddleware(["admin"]), updateUserHandler);
router.delete("/:id", authMiddleware(["admin"]), deleteUserHandler);

module.exports = router;
