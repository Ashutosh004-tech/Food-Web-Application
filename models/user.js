const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Order = require("../models/order.js");
const passportLocalMongoose = require("passport-local-mongoose");

const  UserSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: Number,
        required: true,
    },
    pincode:{
        type:String,
        required: true,
    },
   order: [
        {
          type: Schema.Types.ObjectId,
          ref:"Order",
        },
      ],
});



UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);