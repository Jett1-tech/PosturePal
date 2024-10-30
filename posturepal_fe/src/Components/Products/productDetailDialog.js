import { useState } from "react";
import axios from "axios"; // Import axios
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { getUserIdFromToken } from "../../utils/authUtils";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetailDialog({ open, onClose, product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]); // State cho giỏ hàng

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const updateCart = (newItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.productId === newItem.productId
      );
      if (existingItemIndex > -1) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }

      return [...prevCart, newItem];
    });
  };

  const addToCart = async () => {
    const userId = getUserIdFromToken();
    const productID = product._id;
    
    if (!productID || !selectedColor || !selectedSize || quantity <= 0) {
      console.error("Invalid data: ", {
        userId, 
        productId: productID,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_API_URL}/api/cart/add`,
        {
          userId,
          productId: productID,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          quantity: quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Product added to cart!");
      updateCart(response.data);
      localStorage.setItem("cart", JSON.stringify(updateCart));
      onClose();
    } catch (error) {
      const token = localStorage.getItem("token");
      if (!token) {
      toast.error("You need to login to perform this action!");
      } else {
        toast.error("Failed to Add to Cart");
        console.error(
          "Error adding to cart:",
          error.response?.data || error.message || error
        );
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:block"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={() => onClose()}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                  <img
                    alt={product.imageAlt}
                    src={`${BASE_API_URL}${product.imageSrc}`}
                    className="object-cover object-center"
                  />
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                    {product.name}
                  </h2>
                  <p className="text-2xl text-gray-900">{`${product.price}VND`}</p>

                  <div className="mt-6">
                    <h4 className="sr-only">Reviews</h4>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              product.rating > rating
                                ? "text-gray-900"
                                : "text-gray-200",
                              "h-5 w-5 flex-shrink-0"
                            )}
                          />
                        ))}
                      </div>
                      <p className="sr-only">{product.rating} out of 5 stars</p>
                      <a
                        href="#"
                        className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        {product.reviewCount} reviews
                      </a>
                    </div>
                  </div>

                  <section aria-labelledby="options-heading" className="mt-10">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>
                    <form>
                      {/* Colors */}
                      <fieldset aria-label="Choose a color">
                        <legend className="text-sm font-medium text-gray-900">
                          Color
                        </legend>
                        <RadioGroup
                          value={selectedColor}
                          onChange={setSelectedColor}
                          className="mt-4 flex items-center space-x-3"
                        >
                          {product.colors.map((color) => (
                            <Radio
                              key={color}
                              value={color}
                              className={({ checked }) =>
                                classNames(
                                  checked ? "ring ring-indigo-500" : "",
                                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                                )
                              }
                            >
                              {({ checked }) => (
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    "h-8 w-8 rounded-full border border-black border-opacity-10",
                                    checked
                                      ? "ring-2 ring-offset-2 ring-gray-400"
                                      : ""
                                  )}
                                  style={{ backgroundColor: color }} // Thiết lập màu nền từ màu sản phẩm
                                />
                              )}
                            </Radio>
                          ))}
                        </RadioGroup>
                      </fieldset>

                      {/* Sizes */}
                      <fieldset aria-label="Choose a size" className="mt-10">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            Size
                          </div>
                          <a
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Size guide
                          </a>
                        </div>
                        <RadioGroup
                          value={selectedSize}
                          onChange={setSelectedSize}
                          className="mt-4 grid grid-cols-4 gap-4"
                        >
                          {product.sizes.map((size) => (
                            <Radio
                              key={size}
                              value={size}
                              className={classNames(
                                "cursor-pointer bg-white text-gray-900 shadow-sm",
                                "group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500 sm:flex-1"
                              )}
                            >
                              <span>{size}</span>
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-gray-400"
                              />
                            </Radio>
                          ))}
                        </RadioGroup>
                      </fieldset>

                      {/* Quantity */}
                      <div className="mt-6 flex items-center">
                        <span className="mr-4 text-sm font-medium text-gray-900">
                          Quantity
                        </span>
                        <button
                          type="button"
                          onClick={decrementQuantity}
                          className="mr-2 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium !text-gray-700 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-sm text-gray-900 font-medium">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={incrementQuantity}
                          className="ml-2 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium !text-gray-700 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Button Add to Cart */}
                      <button
                        type="button"
                        onClick={addToCart}
                        className="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                      >
                        Add to Cart
                      </button>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
