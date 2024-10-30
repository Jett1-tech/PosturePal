const crypto = require("crypto");
const axios = require("axios");
const orderService = require("../order-service");
const dotenv = require('dotenv').config()
console.log("dot", dotenv);


const API_URL = process.env.API_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const API_KEY = process.env.API_KEY;
const CHECKSUM_KEY = process.env.CHECKSUM_KEY;
const BASE_FE_URL = process.env.BASE_FE_URL;
function createSignature(data) {
  const sortedKeys = Object.keys(data).sort();
  const sortedData = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");
  return crypto
    .createHmac("sha256", CHECKSUM_KEY)
    .update(sortedData)
    .digest("hex");
}

function generateRandomNumber(length) {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    result += digits[randomByte % 10];
  }
  return parseInt(result, 10);
}

exports.createPayment = async (req, res) => {
  try {
    console.log("Tiến hành tạo link thanh toán");
    const { orderId } = req.body;
    const order = await orderService.getOrderById(orderId);
    console.log(order.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const now = Math.floor(Date.now() / 1000);
    const validExpiredAt = now + 3600;

    const data = {
      orderCode: order.orderId,
      amount: order.totalPrice,
      description: generateRandomNumber(10),
      buyerName: order.shippingAddress.name,
      // userId: data.userId._id,
      buyerPhone: order.shippingAddress.phone,
      buyerAddress:
        order.shippingAddress.address +
        order.shippingAddress.province +
        order.shippingAddress.district +
        order.shippingAddress.ward,
      cancelUrl: `${BASE_FE_URL}/api/cancel/`,
      returnUrl: `${BASE_FE_URL}/`,
      expiredAt: validExpiredAt,
    };

    data.signature = createSignature({
      amount: data.amount,
      cancelUrl: data.cancelUrl,
      description: data.description,
      orderCode: data.orderCode,
      returnUrl: data.returnUrl,
    });

    const fullUrl = API_URL;
    
    console.log("Sending request to:", fullUrl);
    console.log("Request data:", JSON.stringify(data, null, 2));

    const response = await axios.post(fullUrl, data, {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CLIENT_ID,
        "x-api-key": API_KEY,
      },
    });

    console.log("Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    let order = req.params.orderId;
    let url = "https://api-merchant.payos.vn/v2/payment-requests/" + order;
    const response = await axios.get(url, {
      headers: {
        "x-client-id": CLIENT_ID,
        "x-api-key": API_KEY,
      },
    });
    const paymentStatus = response.data.data.status;

    res.json({ status: paymentStatus });
  } catch (error) {
    console.error(
      "Error fetching payment link information:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Failed to fetch payment link information" });
  }
};
exports.getOrderByOrderId = async (req, res) => {
  try {
    let order = req.params.orderId;
    let url = "https://api-merchant.payos.vn/v2/payment-requests/" + order;
    const response = await axios.get(url, {
      headers: {
        "x-client-id": CLIENT_ID,
        "x-api-key": API_KEY,
      },
    });
    const userOrder = response.data;

    res.json({ userOrder });
  } catch (error) {
    console.error(
      "Error fetching payment link information:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Failed to fetch payment link information" });
  }
};
