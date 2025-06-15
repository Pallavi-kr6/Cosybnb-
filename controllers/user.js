
const User = require("../models/user");
module.exports.RenderUserSignup = async(req,res)=>{
    res.render("users/signup");
}

module.exports.UserSignup = async (req, res, next) => {
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
}

module.exports.RenderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}