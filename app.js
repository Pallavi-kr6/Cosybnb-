const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const Listing = require("./models/listing.js");
const app = express();
const methodOverride = require('method-override');
app.use(express.static(path.join(__dirname, "public")));
const ejsMate=require('ejs-mate');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}= require('./schema.js');
const Review = require("./models/review.js");
main()
.then(()=>{
    console.log("connected to mongodb");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Fernweh"); 
    
}


//NEED TO DISPLAY EVERYTHING , CLICK ON IT SO IT SHOWS THE PARTICULAR THING , CREATE NEW , EDIT , DELETE

//DISPLAY ALL LISTINGS
app.get("/", (req, res) => {
    res.redirect("/listings");
});

const validateListing = (req, res, next) => { 
let { error } = listingSchema.validate(req.body); 

if (error) { 
    let  errMsg = error.details.map((el)=>el.message).join(",");
throw new ExpressError (400, errMsg); 
} else { 
next(); 
} 
}; 

const validateReview = (req, res, next) => { 
let { error } = reviewSchema.validate(req.body); 

if (error) { 
    let  errMsg = error.details.map((el)=>el.message).join(",");
throw new ExpressError (400, errMsg); 
} else { 
next(); 
} 
}; 
app.get("/listings", wrapAsync(async (req, res) => {
  console.log("🔥 /listings route hit");
  const listings = await Listing.find({});
  
  res.render("listings/index", { listings });
}));

//CREATE NEW ROUTE
app.get('/listings/new',(req,res)=>{
    res.render("listings/new");
})

//POST ROUTE FOR CREATING NEW LISTING
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
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
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show",{listing});
}))

//edit route

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing }); 
}));


app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
        new: true,
        runValidators: true
    });
    res.redirect(`/listings/${updatedListing._id}`);
}));


//delete route
app.delete('/listings/:id', wrapAsync(async (req, res) => {
     const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);

    res.redirect("/");
}))


// Create Review
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

// If no route matches, handle 404

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});
// Error handler (should be last)
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('listings/error.ejs', { err });
});



app.listen(3000,()=>{
    console.log(`http://localhost:3000`);
})