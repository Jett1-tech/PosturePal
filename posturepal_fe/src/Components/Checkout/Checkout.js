import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb, Select } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { getUserIdFromToken } from "../../utils/authUtils";
import HowYouKnowModal from "./HowYouKnowModal";
import PPLogo from "../../Images/Logo/PPLogo.png";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
// ${BASE_API_URL}
const BASE_FE_URL = process.env.REACT_APP_BASE_FE_URL;
export default function Checkout() {
  const [discountCode, setDiscountCode] = useState("");
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [order, setOrder] = useState();
  const [isChecked, setIsChecked] = useState(false); 

  
 const [modalVisible, setModalVisible] = useState(true);
 const [howYouKnow, setHowYouKnow] = useState("");
 const [formVisible, setFormVisible] = useState(false);

 useEffect(() => {
   setModalVisible(true);
 }, []);

 const handleConfirm = (selection) => {
   console.log("User selection:", selection);
   setHowYouKnow(selection);
   setModalVisible(false); // Đóng modal sau khi xác nhận
 };

 const handleCancel = () => {
   setModalVisible(false); // Đóng modal khi hủy
 };


  const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  };

  useEffect(() => {
    if (location.state && location.state.cart) {
      setCartItems(location.state.cart);
      saveCartToLocalStorage(location.state.cart); 
    } else {
      loadCartFromLocalStorage();
    }
  }, [location.state]);

  // Mỗi khi cartItems thay đổi thì lưu vào localStorage
  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems]);

  // fetch address
  useEffect(() => {
    axios
      .get(`${BASE_API_URL}/api/address/provinces`)
      .then((res) => {
        setProvinces(
          res.data.map((province) => ({
            value: province.Code,
            label: province.Name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setDistricts([]);
    setWards([]);
    setSelectedDistrict(null);
    setSelectedWard(null);
    axios
      .get(`${BASE_API_URL}/api/address/districts/${value}`)
      .then((res) => {
        setDistricts(
          res.data.districts.map((district) => ({
            value: district.Code,
            label: district.Name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setWards([]);
    setSelectedWard(null);
    axios
      .get(`${BASE_API_URL}/api/address/wards/${value}`)
      .then((res) => {
        setWards(
          res.data.wards.map((ward) => ({
            value: ward.Code,
            label: ward.Name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching wards:", error);
      });
  };
  const handleWardChange = (value) => {
    setSelectedWard(value);
  };


  const handleDiscountCodeChange = (e) => setDiscountCode(e.target.value);
  const shippingFee = 1000;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(
        item.productId.price.replace("VND", "").replace(/\./g, "")
      );
      return total + price * item.quantity;
    }, 0);
  };

  // Tính tổng cuối cùng bao gồm cả phí vận chuyển
  const calculateFinalTotal = () => {
    return calculateTotal() + shippingFee;
  };

  const handleCheckout = async (e) => {
  e.preventDefault();
  try {
    const userIdFromToken = getUserIdFromToken();
    const orderData = {
      userId: userIdFromToken,
      products: cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      })),
      totalPrice: calculateFinalTotal(),
      shippingAddress: {
        name,
        phone,
        address,
        province: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
      },
      status: "pending",
      howYouKnowPosturelPal: howYouKnow,
    };
    console.log("know:", orderData);
    if (!orderData.howYouKnowPosturelPal) {
      setModalVisible(true);
    }
    if (!userIdFromToken) {
      toast.error("Session timeout, please login again!");
      return;
    }

    if (!orderData.products || !orderData.totalPrice || !orderData.shippingAddress) {
      toast.error("Please check your fileds data again!")
      return;
    }

    if (!isChecked) {
      toast.error("Please check your checkbox")
      return;
    }

    const response = await axios.post(
      `${BASE_API_URL}/api/order/create`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    
    const orderId = response.data.orderId;
    const userId = response.data.userId;
    
    // Tạo link thanh toán
    const paymentResponse = await axios.post(
      `${BASE_API_URL}/api/payment/create`,
      { orderId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("paymentResponse", paymentResponse);
    
         await axios.delete(`${BASE_API_URL}/api/cart/${userId}/clear`, {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${localStorage.getItem("token")}`,
           },
         });
    console.log("Cart cleared successfully");
    
    window.location.href = paymentResponse.data.data.checkoutUrl;
    
    setOrder(response.data);
    toast.success("Create order successfully!");
  } catch (error) {
    console.error(
      "Lỗi khi tạo đơn hàng:",
      error.response?.data || error.message || error
    );
    toast.error("Failed to create order. Please try again!");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="pb-4">
        <Breadcrumb
          items={[
            {
              title: <a href={BASE_FE_URL}>Home</a>,
            },
            {
              title: "Checkout",
            },
          ]}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <div className="p-8 bg-white shadow-lg rounded-lg">
            <div className="flex justify-center items-center mb-6">
              <img
                alt=""
                className="w-20 h-30 -mt-4 mx-auto"
                src={PPLogo}
              ></img>
            </div>
            <HowYouKnowModal
              visible={modalVisible}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
            <div className="space-y-4">
              {/* Apple Pay Button */}
              <button className="w-full bg-black text-white py-3 rounded-lg text-lg font-semibold">
                 Pay
              </button>
              <div className="flex items-center justify-between py-2">
                <div className="border-b border-gray-300 w-full"></div>
                <span className="px-4 text-sm !text-gray-500">or</span>
                <div className="border-b border-gray-300 w-full"></div>
              </div>

              <form className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium !text-gray-700 mb-1"
                  >
                    Enter your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium !text-gray-700 mb-1"
                  >
                    Phone number
                  </label>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium !text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* City, District, Wards */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium !text-gray-700 mb-1"
                    >
                      City
                    </label>
                    <Select
                      className="w-full"
                      showSearch
                      placeholder="Select a city"
                      options={provinces}
                      onChange={handleProvinceChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-sm font-medium !text-gray-700 mb-1"
                    >
                      District
                    </label>
                    <Select
                      className="w-full"
                      showSearch
                      placeholder="Select a district"
                      options={districts}
                      onChange={handleDistrictChange}
                      disabled={!selectedProvince}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wards"
                      className="block text-sm font-medium !text-gray-700 mb-1"
                      required
                    >
                      Wards
                    </label>
                    <Select
                      className="w-full"
                      showSearch
                      placeholder="Select a ward"
                      options={wards}
                      onChange={handleWardChange}
                      disabled={!selectedDistrict}
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="flex items-center mt-4">
                  <input
                    id="billing-address"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    required
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <label
                    htmlFor="billing-address"
                    className="ml-2 text-sm font-medium !text-gray-700"
                  >
                    Billing address is the same as shipping address
                  </label>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold mt-6"
                >
                  Pay{" "}
                  {calculateFinalTotal().toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    currencyDisplay: "code",
                  })}
                </button>
                <p className="text-sm !text-gray-500 text-center mt-4">
                  Payment details stored in plain text
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Product List */}
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between bg-gray-100 p-4 rounded-lg relative"
                >
                  <img
                    src={`${BASE_API_URL}${item.productId.imageSrc}`}
                    alt={item.productId.imageAlt}
                    className="w-25 h-25 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-1">
                    <p className="absolute top-4 right-4 text-sm font-medium text-gray-900">
                      {parseFloat(
                        item.productId.price
                          .replace("VND", "")
                          .replace(/\./g, "") * item.quantity
                      ).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        currencyDisplay: "code",
                      })}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.productId.name}
                    </h3>
                    <p className="text-sm !text-gray-500">
                      Color: {item.selectedColor}
                    </p>
                    <p className="text-sm !text-gray-500">
                      Size: {item.selectedSize}
                    </p>
                    <p className="text-sm !text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="mt-6">
              <label className="block text-sm font-medium !text-gray-700 mb-1">
                Discount code
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={discountCode}
                  onChange={handleDiscountCodeChange}
                  className="w-full px-2 border-gray-300 !text-gray-600 rounded-l-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-r-lg disabled:true">
                  Apply
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium text-gray-900">
                <p>Subtotal</p>
                <p>
                  {calculateTotal().toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    currencyDisplay: "code",
                  })}
                </p>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-900">
                <p>Discount</p>
                <p>-</p>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-900">
                <p>Shipping</p>
                <p>1.000 VND</p>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <p>Total</p>
                <p>
                  {calculateFinalTotal().toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    currencyDisplay: "code",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
