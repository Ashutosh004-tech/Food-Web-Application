const mongoose = require("mongoose");
const { itemShema } = require("../schema");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  item: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1668143365432-4f359c3a0537?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
  },
});

ItemSchema.post("findOneAndDelete", async (item) => {
  if (item) {
    await Review.deleteMany({ _id: { $in: item.reviews } });
  }
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
