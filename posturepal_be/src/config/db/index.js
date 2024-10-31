const mongoose = require("mongoose");

async function connect() {
  try {
    const uri =
      "mongodb+srv://root:123@cluster1.gb5f1.mongodb.net/PosturePal?retryWrites=true&w=majority&appName=Cluster1";
    await mongoose.connect(uri);
    console.log("Connect to DB Successfully");
  } catch (error) {
    console.log("Connect to DB failure");
  }
}

module.exports = { connect };
