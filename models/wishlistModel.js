const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Your wishlist needs a product ID, Please provide it!"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: String,
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
