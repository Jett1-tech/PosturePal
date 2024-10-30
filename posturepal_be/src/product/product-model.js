const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    imageSrc: { type: String, required: true },
    imageAlt: { type: String, default: "none" },
    colors: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

