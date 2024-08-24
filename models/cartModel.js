const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  cartOwner: String,
  products: [
    {
      count: Number,
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "A cart needs a product Id to be added!"],
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
    path: "products",

    populate: { path: "product", select: "-__v" },
  });

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
