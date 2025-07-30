const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const {userschema} = require("../schema.js");


// Sign up user
router.get("/signup", (req, res, next) => {
  res.render("./user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, mobileNo, password, pincode } = req.body;
      const newUser = new User({ username, email, mobileNo, pincode });
      const registerUser = await User.register(newUser, password);
      req.login(registerUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Signup Successfulyy");
        res.redirect("/");
      }) 
    } catch (err) {
      req.flash("error", "User is already Exist");
      res.redirect("/user/signup");
    }
  })
);

//Login as User
router.get("/login", (req, res, next) => {
  res.render("./user/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("user-local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  async (req, res, next) => {
    req.flash("success", "Login Successfulyy");
    let redirectUrl = res.locals.redirectUrl || "/"
    res.redirect(redirectUrl);
  }
);

module.exports = router;
