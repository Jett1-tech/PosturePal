const cartService = require("./cart-service");
const Cart = require("./cart-model");

const addToCartHandler = async (req, res) => {
  const { userId, productId, quantity, selectedColor, selectedSize } = req.body;

  if (!userId || !productId || !quantity || !selectedColor || !selectedSize) {
    return res.status(400).json({ message: "Invalid data" });
  }
  try {
    const cart = await cartService.addToCart(
      userId,
      productId,
      quantity,
      selectedColor,
      selectedSize
    );
    res.status(200).json(cart);
  } catch (error) {
    console.log(
      "Error adding to cart:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: error.message });
  }
};


const getCartHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await cartService.getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCartHandler = async (req, res) => {
   const { userId } = req.params;
  const { productId, selectedColor, selectedSize } = req.body;

  try {
    const cart = await cartService.removeFromCart(
      userId,
      productId,
      selectedColor,
      selectedSize
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Handler để xóa toàn bộ giỏ hàng sau khi thanh toán thành công
const clearCartHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    await Cart.findOneAndDelete({ userId: userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = {
  addToCartHandler,
  getCartHandler,
  removeFromCartHandler,
  clearCartHandler,
};
