import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DeleteConfirmDialog from "./DeleteConfirmDialog"; // Import the dialog component
import toast from "react-hot-toast";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function ProductList() {
  const [productList, setProductList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/products`);
      setProductList(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteDialog = (id) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`${BASE_API_URL}/api/products/${productToDelete}`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        toast.success("Deleted product success!")
        getProducts();
      } catch (error) {
        toast.error("Deleted product fail!");
        console.error(error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Product List</h1>
        <Link
          to="/admin/create-product"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          Create Product
        </Link>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Product Table</h6>
        </div>
        <div className="card-body">
          {isLoading ? (
            <img
              src="https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif"
              alt="Loading"
            />
          ) : (
            <div className="table-responsive">
              <table
                className="table table-bordered"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>{product.price}</td>
                      <td>
                        <img
                          src={`${BASE_API_URL}${product.imageSrc}`}
                          alt={product.imageAlt}
                          width="50"
                        />
                      </td>
                      <td>
                        <Link
                          to={`/admin/product-view/${product._id}`}
                          className="btn btn-primary btn-sm mr-1"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/product-edit/${product._id}`}
                          className="btn btn-info btn-sm mr-1"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(product._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Render the DeleteConfirmDialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

export default ProductList;
