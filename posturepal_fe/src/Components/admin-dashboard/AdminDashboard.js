import React from "react";
import { Routes, Route } from "react-router-dom";
import Portal from "./Portal";
import Dashboard from "./Dashboard";
import Userlist from "./UserManager/Userlist";
import UserCreate from "./UserManager/UserCreate";
import UserView from "./UserManager/UserView";
import UserEdit from "./UserManager/UserEdit";
import ProductList from "./ProductManager/ProductList";
import ProductCreate from "./ProductManager/ProductCreate";
import ProductView from "./ProductManager/ProductView";
import ProductEdit from "./ProductManager/ProductEdit";
import OrderList from "./OrderManager/OrderList"
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import "./adminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-container">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Portal />}>
          <Route
            path="dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="user-list"
            element={<ProtectedRoute element={<Userlist />} />}
          />
          <Route
            path="create-user"
            element={<ProtectedRoute element={<UserCreate />} />}
          />
          <Route
            path="user-view/:id"
            element={<ProtectedRoute element={<UserView />} />}
          />
          <Route
            path="user-edit/:id"
            element={<ProtectedRoute element={<UserEdit />} />}
          />
          <Route
            path="products"
            element={<ProtectedRoute element={<ProductList />} />}
          />
          <Route
            path="create-product"
            element={<ProtectedRoute element={<ProductCreate />} />}
          />
          <Route
            path="product-view/:id"
            element={<ProtectedRoute element={<ProductView />} />}
          />
          <Route
            path="product-edit/:id"
            element={<ProtectedRoute element={<ProductEdit />} />}
          />
          <Route
            path="order-list"
            element={<ProtectedRoute element={<OrderList />} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default AdminDashboard;
