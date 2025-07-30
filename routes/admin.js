const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


 
//Signup as admin
router.get("/signup", (req, res, next) => {
  res.render("./admin/signUp.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { shopName, username, email, mobileNo, password } = req.body;
      const newAdmin = new Admin({ shopName, username, email, mobileNo });
      const registerUser = await Admin.register(newAdmin, password);
      req.login(registerUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Register Successfulyy");
        res.redirect("/");
      }) 
    } catch (err) {
      req.flash("error", "User is already Exist");
      res.redirect("/admin/signup");
    }
  })
);

// Login as Admin
router.get("/login", (req, res, next) => {
  res.render("./admin/login.ejs");
});

router.post(
  "/login", 
  saveRedirectUrl,
    passport.authenticate('admin-local', {
        failureRedirect: "/admin/login",
        failureFlash: true,
      }),
      async (req, res, next) => {
        req.flash("success", "Login Successfulyy");
        let redirectUrl = res.locals.redirectUrl || "/"
        res.redirect(redirectUrl);
    },
);


module.exports = router;
