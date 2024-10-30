const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1/PosturePal");
    console.log("Connect to DB Successfully");
  } catch (error) {
    console.log("Connect to DB failure");
  }
}

module.exports = { connect };
