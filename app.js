const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const app = express();
const methodOverride = require('method-override');
app.use(express.static(path.join(__dirname, "public")));
const ejsMate=require('ejs-mate');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies



const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
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


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)





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