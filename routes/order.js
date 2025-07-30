const express = require("express");
const router = express.Router();
const Item = require("../models/item.js");
const Order = require("../models/order.js");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isUserLoggedIn } = require("../middleware.js");
const ExpressError = require("../utils/ExpressError.js");

// get route for view all orders
router.get("/cart", wrapAsync( async (req, res) => {
  if (req.user) {
    if(req.user.order.length == 0){
      return res.render("./includes/emptyOrder.ejs");
    }
    let userOrd = await User.findById(req.user._id).populate({
      path: "order",
      populate: { path: "itemId", model: "Item" },
    });
      return res.render("./orders/ordercart.ejs",{orders : userOrd.order});
  }
  res.redirect("/user/login");
}));

// POST /order/:itemId - Place an order for an item
router.get("/:id", isUserLoggedIn, wrapAsync( async (req, res) => {
  try {
    const itemId = req.params.id;
    const userId = req.user._id;

    // Create a new order
    const newOrder = new Order({ itemId });
    await newOrder.save();

    // Add order to the user's order array
    const user = await User.findById(userId);
    user.order.push(newOrder._id);
    await user.save();
    req.flash("success", "Order added Successfully");
    res.redirect("/order/cart");
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}));

// Delete a order item 
router.delete("/:id", isUserLoggedIn, wrapAsync(async (req, res) => {
  try {
    const { id } = req.params;

    const orderToDelete = await Order.findOne({ itemId: id });

    if (orderToDelete) {
      await Order.findByIdAndDelete(orderToDelete._id);
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { order: orderToDelete._id }
      });
    }

    res.redirect("/order/cart");
  } catch (err) {
    throw new ExpressError(404, "Something went wrong");
  }
}));

module.exports = router;
