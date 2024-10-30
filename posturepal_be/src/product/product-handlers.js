const productService = require("./product-service");

const createProduct = async (req, res) => {
  try {
    const { name, price, imageAlt, rating, reviewCount} = req.body;
    const imageSrc = req.file ? `/images/${req.file.filename}` : null;
    const parsedColors = req.body.colors ? JSON.parse(req.body.colors) : [];
    const parsedSizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];

    const productData = {
      name,
      price,
      imageSrc,
      imageAlt,
      colors: parsedColors,
      sizes: parsedSizes,
      rating,
      reviewCount,
    };
    console.log("Product:",productData);
    
     const product = await productService.createProduct(productData);
     
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err);
  }
};


const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
};
