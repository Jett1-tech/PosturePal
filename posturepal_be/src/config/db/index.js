const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb+srv://root:123@cluster0.ld5nn.mongodb.net/PosturePal?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connect to DB Successfully");
  } catch (error) {
    console.log("Connect to DB failure");
  }
}

module.exports = { connect };
