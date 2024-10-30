import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { getUserIdFromToken } from "../../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;


export default function ShoppingCart({ open, setOpen }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = getUserIdFromToken();
      try {
        const response = await axios.get(`${BASE_API_URL}/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
          localStorage.setItem("cart", JSON.stringify(response.data.products));
        } else {
          console.error("Data returned is not an array:", response.data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setProducts([]);
      }
    };

    if (open) {
      fetchCartItems();
    } else {
      // Khi dialog không mở, có thể lấy lại cart từ localStorage
      const storedCart = localStorage.getItem("cart");
      if (storedCart && storedCart !== "undefined") {
        try {
          setProducts(JSON.parse(storedCart));
        } catch (error) {
          console.error("Error parsing stored cart:", error);
          setProducts([]); // Đặt sản phẩm về mảng rỗng nếu có lỗi
        }
      }
    }
  }, [open]);

  const handleRemove = async (product) => {
    const userId = getUserIdFromToken();
    try {
      await axios.delete(`${BASE_API_URL}/api/cart/${userId}/remove`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          productId: product.productId._id,
          selectedColor: product.selectedColor,
          selectedSize: product.selectedSize,
        },
      });

      // Cập nhật lại state để loại bỏ sản phẩm đã xóa
      setProducts((prevProducts) =>
        prevProducts.filter(
          (p) =>
            !(
              p.productId._id === product.productId._id &&
              p.selectedColor === product.selectedColor &&
              p.selectedSize === product.selectedSize
            )
        )
      );
      // Cập nhật lại localStorage
      const updatedCart = products.filter(
        (p) =>
          !(
            p.productId._id === product.productId._id &&
            p.selectedColor === product.selectedColor &&
            p.selectedSize === product.selectedSize
          )
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  // Tính tổng giá trị giỏ hàng
  const calculateSubtotal = () => {
    return products
      .reduce((total, product) => {
        const price = parseFloat(
          product.productId.price.replace("VND", "").replace(/\./g, "")
        );
        return total + price * product.quantity;
      }, 0)
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  // Hàm xử lý khi nhấn nút Checkout
const handleCheckout = () => {
  const checkoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(); // Promise được hoàn thành sau 1.5 giây
    }, 1500);
  });

  toast
    .promise(checkoutPromise, {
      loading: "Saving cart...",
      success: <b>Redirect to Checkout page</b>,
      error: <b>Redirect to Checkout failed.</b>,
    })
    .then(() => {
      navigate("/checkout", { state: { cart: products } });
    });
};
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition-transform duration-500 ease-in-out data-[closed]:translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md !text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-lg font-bold text-gray-900">
                    Shopping cart
                  </DialogTitle>
                </div>
                <div className="mt-8 flex-1 px-4 sm:px-6">
                  <div className="flow-root">
                    <ul className="-my-6 -ml-8 divide-y divide-gray-200">
                      {products.map((product) => {
                        if (!product.productId) {
                          console.error("Missing product data:", product);
                          return null;
                        }
                        const productTotal =
                          parseFloat(
                            product.productId.price
                              .replace("VND", "")
                              .replace(/\./g, "")
                          ) * product.quantity;

                        return (
                          <li key={product.productId._id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={`${BASE_API_URL}${product.productId.imageSrc}`} // Đảm bảo lấy đúng đường dẫn hình ảnh
                                alt={product.productId.imageAlt}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-semibold text-gray-900">
                                  <h7>
                                    <a href={product.productId.href}>
                                      {product.productId.name}
                                    </a>
                                  </h7>
                                  {/* Hiển thị tổng tiền của sản phẩm dựa trên số lượng */}
                                  <p className="ml-4">
                                    {productTotal.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                      currencyDisplay: "code",
                                    })}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm !text-gray-700">
                                  Color: {product.selectedColor}{" "}
                                </p>
                                <p className="mt-1 text-sm !text-gray-700">
                                  Size: {product.selectedSize}{" "}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p className="!text-gray-700">
                                  Quantity: {product.quantity}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(product)}
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    {/* Hiển thị tổng số tiền của giỏ hàng */}
                    <p>{calculateSubtotal()}</p>
                  </div>
                  <p className="mt-0.5 text-sm !text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleCheckout}
                      disabled={products.length === 0}
                      className={`w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm ${
                        products.length === 0
                          ? "cursor-not-allowed bg-gray-400"
                          : "hover:bg-indigo-700"
                      }`}
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm !text-gray-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
