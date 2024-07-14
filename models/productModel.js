const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a product title!"],
    minlength: [3, "A title should have at least 3 minimum characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide a product description!"],
    minlength: [8, "A description should have at least 8 minimum characters!"],
  },
  price: {
    type: Number,
    required: [true, "A title should have a price!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
