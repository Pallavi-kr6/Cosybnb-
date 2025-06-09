const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        ? "https://unsplash.com/photos/low-angle-photography-of-high-rise-building-pPxhM0CRzl4"
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
  ]
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) { 
    await Review.deleteMany({ _id: { $in: listing.reviews } }); 
  } 
});

const listing = mongoose.model("listing",listingSchema);

module.exports = listing;