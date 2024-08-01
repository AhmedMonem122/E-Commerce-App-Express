const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "Your wishlist needs a product ID, Please provide it!"],
    unique: true,
  },
});

wishlistSchema.pre(/^find/g, function (next) {
  this.populate({
    path: "product",
    select: "-__v",
  });

  next();
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
