const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//title , description , image,price , location , country
const ListingSchema = new Schema({
 title : {
    type: String,
    required:true,
 },
 description: String,
 image: {
  filename: String,
  url: {
    type: String,
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/low-angle-photography-of-high-rise-building-pPxhM0CRzl4"
        : v,
  }
},

 price:{
    type:Number,
    required:true,
 },
 location:{
    type:String,
    required:true,
 },
    country:{
        type:String,
        required:true,
    },


})

const Listing = mongoose.model("Listing",ListingSchema);



module.exports = Listing;