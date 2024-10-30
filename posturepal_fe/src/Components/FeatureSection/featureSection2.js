import React from "react";
import { Divider } from "antd";
const ProtectDevice = () => {
  return (
    <div className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Divider />
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Protect your device
            </h2>
            <p className="mt-4 leading-6 !text-gray-600">
              As a digital creative, your laptop or tablet is at the center of
              your work. Keep your device safe with a fabric sleeve that matches
              in quality and looks.
            </p>
          </div>
          <div className="mt-10 lg:mt-0">
            <img
              className="rounded-lg shadow-lg"
              src="https://tailwindui.com/plus/img/ecommerce-images/product-feature-02-full-width.jpg"
              alt="Product feature"
            />
          </div>
        </div>
        <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="lg:col-start-1">
            <img
              className="rounded-lg shadow-lg"
              src="https://tailwindui.com/plus/img/ecommerce-images/product-feature-02-full-width.jpg"
              alt="Product detail 1"
            />
          </div>
          <div className="lg:col-start-2 lg:mt-0 pt-4">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Minimal and thoughtful
            </h2>
            <p className="mt-4 leading-6 !text-gray-600">
              Our laptop sleeve is compact and precisely fits 13" devices. The
              zipper allows you to access the interior with ease, and the front
              pouch provides a convenient place for your charger cable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectDevice;
