const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const  orderSchema = new Schema({
    itemId:{
        type:Schema.Types.ObjectId,
        ref:"Item"
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;