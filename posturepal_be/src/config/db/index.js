const mongoose = require("mongoose");

async function connect() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Sử dụng biến môi trường
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(uri, options);
    console.log("Connect to DB Successfully");
  } catch (error) {
    console.error("Connect to DB failure:", error.message);
    throw error;
  }
}

module.exports = { connect };
