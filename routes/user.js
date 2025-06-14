const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Adjust the path based on your project
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");




router.get('/signup',async(req,res)=>{
    res.render("users/signup");

})

router.post("/signup", wrapAsync(async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // safely handles login error
      }
      req.flash("success", "Welcome to Cosybnb");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post( 
"/login",saveRedirectUrl, 
passport.authenticate("local", { 
failureRedirect: "/login", 
failureFlash: true, 
}), 
async (req, res) => { 
req.flash("success","Welcome Back To Cosybnb");
let redirectUrl = res.locals.redirectUrl || "/"
res.redirect(redirectUrl);
} 
);

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have logged out");
        res.redirect("/");
    })
})

module.exports=router;