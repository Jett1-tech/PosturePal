const express = require("express");
const handler = require("./payment-handlers");

const router = express.Router();

module.exports = () => {
  router
    .post("/create", handler.createPayment)
    .get("/order-status/:orderId", handler.getOrderStatus)
    .get("/:orderId", handler.getOrderByOrderId);
  return router;
};
