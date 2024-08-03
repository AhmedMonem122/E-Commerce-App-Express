const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartOwner: String,
  products: [
    {
      count: {
        type: Number,
        default: 0,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
      price: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  totalCartPrice: Number,
});

cartSchema.pre(/^find/g, function (next) {
  this.populate({
    path: "product",
    select: "-__v",
  });

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
