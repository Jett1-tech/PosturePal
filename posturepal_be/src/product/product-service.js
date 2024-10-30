const Product = require("./product-model");

const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const getProducts = async () => {
  return await Product.find();
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
};
