const Order = require("./order-model");

const createOrder = async (orderData) => {
  const newOrder = new Order(orderData);
  return await newOrder.save();
};

const getAllOrders = async () => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Could not fetch orders");
  }
};

const getOrderByUserId = async (userId) => {
  return await Order.find({ userId }).populate("products.productId");
};

const getOrderById = async (orderId) => {
  console.log("order service", orderId);

  const order = await Order.findOne(
    {
      orderId: orderId,
    }
  )
    .populate("userId", "_id") // password
    .populate("products.productId");

  console.log(order);
  if (!order) {
    throw new Error("Order not found");
  }

  // select customer.id, order.name, customer.name from customer join order on customer.orderId = order.id
  // orm entity

  return order;
};

const approveOrder = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }
  order.status = status;
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderByUserId,
  getOrderById,
  approveOrder,
};
