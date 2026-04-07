require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Item = require("./models/item.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Admin = require("./models/admin.js");
const User = require("./models/user.js");

const Mongo_URL = process.env.MongoDB_URL;
const PORT = process.env.PORT;
const Session_Secret = process.env.SESSION_SECRECT;

const items = require("./routes/items.js");
const reviews = require("./routes/reviews.js");
const admin = require("./routes/admin.js");
const user = require("./routes/user.js");
const order = require("./routes/order.js");

// Databse connection
main()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MongoDB_URL);
}

//app setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Session Option
const sessionOption = {
  secret : process.env.SESSION_SECRECT,
  resave:false,
  saveUninitialized : true,
  cookie:{
    expiers : Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly : true,
  },
};
app.use(session(sessionOption));

// Flash Msg
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// User Strategy
passport.use("user-local", new LocalStrategy(User.authenticate()));
// Admin Strategy
passport.use("admin-local", new LocalStrategy(Admin.authenticate()));

// Serialize and Deserialize
passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user instanceof Admin ? "Admin" : "User" });
});

passport.deserializeUser(async (data, done) => {
  const Model = data.type === "Admin" ? Admin : User;
  try {
    const user = await Model.findById(data.id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


// Setting up res.locals for every templates

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.failuer = req.flash("failuer");
  res.locals.error = req.flash("error");
  res.locals.isAdmin = req.user instanceof Admin ;
  res.locals.crnUser = req.user;
  next();
});

// Index Route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    const allItems = await Item.find({});
    res.render("index.ejs", { allItems });
  })
);

//Routes
app.use("/items", items);
app.use("/items/:id/reviews", reviews);
app.use("/admin", admin);
app.use("/user", user);
app.use("/order", order);

// Log out
app.get("/logout", (req,res)=>{
  req.logout((err)=>{
    if(err){
    return next(err);
    }
    req.flash("success", "Logout Successfully");
    res.redirect("/");
  });
})

// 404 page
app.all("*", (req, res, next) => {
  res.render("./includes/pageNotFound.ejs");
});

// General error handling
app.use((err, req, res, next) => {
  let { status = 500, msg = "something went wrong!" } = err;
  res.status(status).render("error.ejs", { msg });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log("Server Started");
});


