const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("./user-service");

const signupHandler = async (req, res) => {
  const { username, phone, password } = req.body;
  try {
    const { user, token } = await signup(username, phone, password);
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  const { isAdminPage } = req.query; // Nhận tham số từ query
  try {
    const { user, token } = await login(
      username,
      password,
      isAdminPage === "true"
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logoutHandler = (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ message: "No user is logged in." });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
};


const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
};
