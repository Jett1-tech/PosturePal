const express = require("express");
const {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderByUserIdHandler,
  getOrderByIdHandler,
  approveOrderHandler,
} = require("./order-handlers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to create a new order
router.post("/create", createOrderHandler);

// Route to get all orders (admin access)
router.get("/orders", authMiddleware(["admin"]), getAllOrdersHandler);

// Route to get orders by userId
router.get("/user/:userId", getOrderByUserIdHandler);

// Route to get an order by orderId
router.get("/:orderId", getOrderByIdHandler);

// Route to approve or reject an order (admin access)
router.patch("/approve", authMiddleware(["admin"]), approveOrderHandler);

module.exports = router;
