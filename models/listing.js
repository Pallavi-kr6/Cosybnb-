const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("../models/review.js");
const { ref } = require('joi');


const listingSchema = new Schema({
 title:{
    type:String,
    required:true,
 },
 description:String,
 image: {
  filename: String,
  url: {
    type: String,
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/premium_photo-1748960861503-99b1f5412a81?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
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
  reviews :[
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner : 
    {
      type:Schema.Types.ObjectId,
      ref:"User",
    }
    ,
    geometry:{
      type:{
        type:String,
        enum: ['Point'],
        required:true
      },
      coordinates:{
        type:[Number],
        required:true
      }
    },
  category:{
    type:String,
    enum:["Trending","Rooms","Iconic Cities","Mountains","Castles","Artic"]
  }
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) { 
    await Review.deleteMany({ _id: { $in: listing.reviews } }); 
  } 
});

const listing = mongoose.model("listing",listingSchema);

module.exports = listing;