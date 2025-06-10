const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema}= require('../schema.js');




const validateListing = (req, res, next) => { 
let { error } = listingSchema.validate(req.body); 

if (error) { 
    let  errMsg = error.details.map((el)=>el.message).join(",");
throw new ExpressError (400, errMsg); 
} else { 
next(); 
} 
}; 




router.get("/", wrapAsync(async (req, res) => {
  console.log("🔥 /listings route hit");
  const listings = await Listing.find({});
  
  res.render("listings/index", { listings });
}));

//CREATE NEW ROUTE
router.get('/new',(req,res)=>{
    res.render("listings/new");
})

//POST ROUTE FOR CREATING NEW LISTING
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const { listing } = req.body;

    if (!listing.image || !listing.image.url || listing.image.url.trim() === "") {
        listing.image = {
            filename: "default.jpg",
            url: "https://unsplash.com/photos/low-angle-photography-of-high-rise-building-pPxhM0CRzl4"
        };
    }

    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/");
}));

//showing each listing in detail
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show",{listing});
}))

//edit route

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing }); 
}));


router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
        new: true,
        runValidators: true
    });
    res.redirect(`/listings/${updatedListing._id}`);
}));


//delete route
router.delete('/:id', wrapAsync(async (req, res) => {
  console.log("Delete route hit for ID:", req.params.id);
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    console.log("Listing not found");
    return res.redirect('/'); // Or handle with error message
  }
  await Listing.findByIdAndDelete(req.params.id);
  console.log("Listing deleted");
  res.redirect('/');
}));




module.exports = router;