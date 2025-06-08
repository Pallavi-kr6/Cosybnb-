const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Fernweh"); 
    console.log("Connected to MongoDB");

    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Initial data inserted!");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}

main();
