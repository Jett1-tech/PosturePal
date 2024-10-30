import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>Product Details</h1>
      <p>
        <strong>ID:</strong> {product._id}
      </p>
      <p>
        <strong>Name:</strong> {product.name}
      </p>
      <p>
        <strong>Price:</strong> {product.price}
      </p>
      <p>
        <strong>Image:</strong>{" "}
        <img
          src={`${BASE_API_URL}${product.imageSrc}`}
          alt={product.imageAlt}
          width="200"
        />
      </p>
      <p>
        <strong>Colors:</strong> {product.colors}
      </p>
      <p>
        <strong>Sizes:</strong> {product.sizes}
      </p>
      <p>
        <strong>Rating:</strong> {product.rating}
      </p>
      <p>
        <strong>Review Count:</strong> {product.reviewCount}
      </p>
    </div>
  );
}

export default ProductView;
