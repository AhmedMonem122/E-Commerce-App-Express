const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "A payment must belong to at least one product!"],
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A payment must belong to a user!"],
  },
  price: {
    type: Number,
    required: [true, "A payment must have a price!"],
  },
  amount: {
    type: Number,
    required: [true, "A payment must have an amount!"],
  },
  paid: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
});

paymentSchema.pre(/^find/g, function (next) {
  this.populate({
    path: "product",
    select: "-__v",
  }).populate({
    path: "user",
    select: "-__v",
  });
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
