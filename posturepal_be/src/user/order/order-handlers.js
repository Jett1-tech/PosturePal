const orderService = require("./order-service");
const crypto = require("crypto");

function generateRandomNumber(length) {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    result += digits[randomByte % 10];
  }
  console.log(result)
  return parseInt(result, 10);
}


const createOrderHandler = async (req, res) => {
  let idRd = generateRandomNumber(8)
  console.log(req.body)
  try {
    const orderData = {
      orderId: idRd,
      userId: req.body.userId,
      products: req.body.products,
      totalPrice: req.body.totalPrice,
      shippingAddress: req.body.shippingAddress,
      howYouKnowPosturelPal: req.body.howYouKnowPosturelPal,
    };
    if (!orderData) {
    return res.status(400).json({ message: "Invalid data" });
    }
    console.log(orderData);
    
    const newOrder = await orderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrdersHandler = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderByUserIdHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await orderService.getOrderByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderByIdHandler = async (req, res) => {
  try {
    const orderId = req.params.orderId; // Lấy orderId từ params
    const order = await orderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const approveOrderHandler = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const updatedOrder = await orderService.approveOrder(orderId, status);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrderHandler,
  getAllOrdersHandler,
  getOrderByUserIdHandler,
  getOrderByIdHandler,
  approveOrderHandler,
};
