const express = require("express");
const router = express.Router({mergeParams:true});
const {  reviewShema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Item = require("../models/item.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

const validateReviewShcema = (req, res, next) => {
  let { error } = reviewShema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Reviews
// Post Route
router.post(
    "/", isLoggedIn,
    validateReviewShcema,
    wrapAsync(async (req, res, next) => {
      let item = await Item.findById(req.params.id);
      let newReview = new Review(req.body.review);
      newReview.user = req.user._id;
      item.reviews.push(newReview);
      await newReview.save();
      await item.save();
      req.flash("success", "Review Added Successfully");
      res.redirect(`/items/${req.params.id}`);
    })
  );


  // Delete Reviews Route
router.delete("/:reviewid",wrapAsync( async (req,res, next)=>{
    let {id, reviewid} = req.params;
    await Item.findByIdAndUpdate(id, {$pull:{reviews : reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("failuer", "Review Deleted Successfully");
    res.redirect(`/items/${id}`);
  }));

  module.exports = router;