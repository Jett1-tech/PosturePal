import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Table, Select } from "antd";
import toast from "react-hot-toast";
const { Option } = Select;
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [paymentStatuses, setPaymentStatuses] = useState({});
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get(`${BASE_API_URL}/api/order/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const ordersWithAddressNames = await Promise.all(
          response.data.map(async (order) => {
            const provinceResponse = await axios.get(
              `${BASE_API_URL}/api/address/provinces/${order.shippingAddress.province}`
            );

            const districtResponse = await axios.get(
              `${BASE_API_URL}/api/address/district/${order.shippingAddress.district}`
            );

            const wardResponse = await axios.get(
              `${BASE_API_URL}/api/address/ward/${order.shippingAddress.ward}`
            );

            return {
              ...order,
              shippingAddress: {
                ...order.shippingAddress,
                province: provinceResponse.data.Name,
                district: districtResponse.data.Name,
                ward: wardResponse.data.Name,
              },
            };
          })
        );

        setOrderList(ordersWithAddressNames);
      }
    } catch (error) {
      console.error(
        "Lỗi fetch order:",
        error.response?.data || error.message || error
      );
      toast.error("Failed to load orders!");
    } finally {
      setLoading(false);
    }
  };

  // Lấy trạng thái thanh toán cho từng đơn hàng
const fetchPaymentStatus = async (orderId) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 giây delay
    const response = await axios.get(
      `${BASE_API_URL}/api/payment/order-status/${orderId}`
    );
    console.log(`Response for orderId ${orderId}:`, response.data.status);
    return response.data.status || "Unknown";
  } catch (error) {
    console.error(
      `Failed to fetch payment status for order ${orderId}:`,
      error
    );
    return "Unknown"; 
  }
};

  // Lấy trạng thái thanh toán cho tất cả các đơn hàng sau khi orderList được cập nhật
  useEffect(() => {
    if (orderList.length > 0) {
      const fetchAllPaymentStatuses = async () => {
        const statuses = {};
        for (const order of orderList) {
          const status = await fetchPaymentStatus(order.orderId);
          statuses[order.orderId] = status;
        }
        setPaymentStatuses(statuses);
      };

      fetchAllPaymentStatuses();
    }
  }, [orderList]);

  const setOrderStatus = async (orderId) => {
    const newStatus = orderStatuses[orderId];
    if (!newStatus) {
      toast.error("Please select a status before saving.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${BASE_API_URL}/api/order/approve`,
        { orderId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order status updated successfully!");
      getOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status!");
    }
  };

  const openProductModal = (products) => {
    setSelectedProducts(products);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProducts([]);
  };

  const productColumns = [
    {
      title: "Product Name",
      dataIndex: "productId",
      key: "name",
      render: (product) => product.name,
    },
    {
      title: "Price",
      dataIndex: "productId",
      key: "price",
      render: (product) => product.price,
    },
    {
      title: "Selected Color",
      dataIndex: "selectedColor",
      key: "selectedColor",
    },
    {
      title: "Selected Size",
      dataIndex: "selectedSize",
      key: "selectedSize",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Order List</h1>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Order Table</h6>
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
                    <th>Order ID</th>
                    <th>Shipping Detail</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Products</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>
                        {order.shippingAddress.name}, <br />
                        {order.shippingAddress.phone}, <br />
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.ward},{" "}
                        {order.shippingAddress.district},{" "}
                        {order.shippingAddress.province}
                      </td>
                      <td>{order.totalPrice}</td>
                      <td>
                        <Select
                          defaultValue={order.status}
                          style={{ width: 120 }}
                          onChange={(value) => {
                            setOrderStatuses((prev) => ({
                              ...prev,
                              [order._id]: value,
                            }));
                          }}
                        >
                          <Option value="Pending">Pending</Option>
                          <Option value="Approved">Approved</Option>
                          <Option value="Rejected">Rejected</Option>
                        </Select>
                        <br />
                        <div className="pt-2 flex">
                          <Button
                            type="primary"
                            onClick={() => setOrderStatus(order._id)}
                          >
                            Save order status
                          </Button>
                        </div>
                      </td>
                      {/* Hiển thị trạng thái thanh toán */}

                      <td>
                        <Button
                          onClick={() => openProductModal(order.products)}
                          type="primary"
                        >
                          View Products
                        </Button>
                      </td>
                      <td>{paymentStatuses[order.orderId] || "Loading..."}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Product Details"
        visible={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        <Table
          dataSource={selectedProducts}
          columns={productColumns}
          rowKey={(record) => record._id}
          pagination={false}
        />
      </Modal>
    </>
  );
}

export default OrderList;
