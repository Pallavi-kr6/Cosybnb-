
if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}


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
const session = require('express-session');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


//requiring express sessions
const sessionOptions = {
    secret :"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },

}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

const listingRouter = require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
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
// SESSION AND FLASH SETUP
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// ✅ Set flash messages and current user (optional)
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user; // optional for navbar logic
    next();
});

// ✅ All routes go below this line
app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// Home route
app.get("/", (req, res) => {
    res.redirect("/listings");
});



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