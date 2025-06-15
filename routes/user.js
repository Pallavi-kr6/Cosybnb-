const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Adjust the path based on your project
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const UserController = require("../controllers/user.js");


router
.route("/signup")
.get(UserController.RenderUserSignup)
.post( wrapAsync(UserController.UserSignup));

router 
  .route("/login")
  .get(UserController.RenderLoginForm)
  .post( saveRedirectUrl, 
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