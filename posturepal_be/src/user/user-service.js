const User = require("./user-model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("./token/token");

// Xử lý logic đăng ký người dùng
const signup = async (username, phone, password) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username already exists");
  }
  const user = new User({ username, phone, password });
  await user.save();
  const token = generateToken(user);
  return { user, token };
};

// Xử lý logic đăng nhập
const login = async (username, password, isAdminPage) => {
  const user = await User.findOne({ username });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new Error("Invalid username or password");
  }

  // Kiểm tra quyền truy cập dựa trên vai trò
  if (isAdminPage && user.userRole !== "admin") {
    throw new Error("Unauthorized. Only admins can login on this page.");
  }

  if (!isAdminPage && user.userRole === "admin") {
    throw new Error("Unauthorized. Admins cannot login here.");
  }

  const token = generateToken(user);
  return { user, token };
};

const getAllUsers = async () => {
  const users = await User.find({});
  return users;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};