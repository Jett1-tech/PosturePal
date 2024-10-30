import React, { useEffect, useState } from "react";
import axios from "axios";
import { Divider } from "antd";
import ProductDetailDialog from "./productDetailDialog"; // Đảm bảo tên file là đúng
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">
        Our Products
      </h2>
      <Divider />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="group relative cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={`${BASE_API_URL}${product.imageSrc}`}
                alt={product.imageAlt}
                className="object-cover object-center"
              />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="mt-1 text-sm !text-gray-600">{`${product.price}VND`}</p>
          </div>
        ))}
      </div>
      <Divider />

      {selectedProduct && (
        <ProductDetailDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default ProductList;
