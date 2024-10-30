const Cart = require("./cart-model");

const addToCart = async (
  userId,
  productId,
  quantity,
  selectedColor,
  selectedSize
) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId == productId &&
          p.selectedColor == selectedColor &&
          p.selectedSize == selectedSize
      );

      if (productIndex > -1) {
        // Sản phẩm đã có trong giỏ, tăng số lượng
        cart.products[productIndex].quantity += quantity;
      } else {
        // Sản phẩm chưa có trong giỏ, thêm mới
        cart.products.push({
          productId,
          quantity,
          selectedColor,
          selectedSize,
        });
      }
    } else {
      cart = new Cart({
        userId,
        products: [{ productId, quantity, selectedColor, selectedSize }],
      });
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error adding to cart: " + error.message);
  }
};

const getCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  } catch (error) {
    throw new Error("Error fetching cart: " + error.message);
  }
};

const removeFromCart = async (
  userId,
  productId,
  selectedColor,
  selectedSize
) => {
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.products = cart.products.filter(
        (p) =>
          !(
            p.productId == productId &&
            p.selectedColor == selectedColor &&
            p.selectedSize == selectedSize
          )
      );

      await cart.save();
      return cart;
    } else {
      throw new Error("Cart not found");
    }
  } catch (error) {
    throw new Error("Error removing from cart: " + error.message);
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
