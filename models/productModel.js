const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide product title!"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
