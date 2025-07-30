
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    comment: {
        type: String,
    },
    rating: {
        type: String,
        min:1,
        max:5,
    },
    createdAt : {
        type: Date,
        default: Date.now(),
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});


const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;