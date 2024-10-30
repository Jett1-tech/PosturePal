// src/server.js
require("dotenv").config(); 
const express = require("express");
const morgan = require('morgan')
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const db = require("./config/db/index");

const app = express();
const port = 4000;
app.use(morgan('dev'))
// Kết nối MongoDB
db.connect();

// Middleware
app.use(
  cors({
    origin: ["https://posture-pal-fe.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.json());

// Cấu hình session
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 },
  })
);

// Phục vụ file ảnh từ thư mục public/images
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Route mặc định
app.get("/", (req, res) => {
  res.send("SUCCESS!!");
});

// Các route khác
app.use("/api/address", require("./address/address-routes")());
app.use("/api/user", require("./user/user-routes"));
app.use("/api/products", require("./product/product-routes"));
app.use("/api/cart", require("./user/cart/cart-routes"));
app.use("/api/order", require("./user/order/order-routes"));
app.use("/api/payment", require("./user/order/payment/payment-routes")())
// Khởi động server
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
