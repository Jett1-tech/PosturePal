const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ["admin", "buyer"],
    default: "buyer",
  },

});

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Phương thức xác thực mật khẩu
userSchema.methods.isPasswordMatch = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
