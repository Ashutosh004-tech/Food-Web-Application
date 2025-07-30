const express = require("express");
const router = express.Router();
const Item = require("../models/item.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { itemShema, reviewShema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

// Validate Schema using Joi
const validateShcema = (req, res, next) => {
  let { error } = itemShema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Privacy & Terms Page
router.get("/privacyterms", (req, res) => {
  res.render("privacyTerms.ejs");
});
//add new items
router.get("/new", isLoggedIn, (req, res) => {
  res.render("new.ejs");
});


// Show Item Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const item = await Item.findById(id)
      .populate({ path: "reviews", populate: { path: "user" } })
      .populate("owner");
    if (!item) {
      req.flash("error", "Item you request for does not exist");
      return res.redirect("/");
    }
    res.render("show.ejs", { item });
  })
);

//add new items
router.post(
  "/",
  isLoggedIn,
  validateShcema,
  wrapAsync(async (req, res, next) => {
    const newItems = new Item(req.body.items);
    newItems.owner = req.user._id;
    await newItems.save();
    req.flash("success", " New Item Added Successfully");
    res.redirect("/");
  })
);

//Update item details
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      req.flash("error", "Item you request for does not exist");
      return res.redirect("/");
    }
    res.render("edit.ejs", { item });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateShcema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Item.findByIdAndUpdate(id, { ...req.body.items });
    req.flash("success", "Item Update Successfully");
    res.redirect(`/items/${id}`);
  })
);

//Delte Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Item.findByIdAndDelete(id);
    req.flash("success", "Item Deleted Successfully");
    res.redirect("/");
  })
);

module.exports = router;
