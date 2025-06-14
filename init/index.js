const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Fernweh"); 
    console.log("Connected to MongoDB");

    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"684b06b8f3eeba042d448c52",

    }));
    await Listing.insertMany(initdata.data);
    console.log("Initial data inserted!");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
}

main();
