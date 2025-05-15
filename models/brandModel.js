const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a brand title!"],
    minlength: [3, "A title should have at least 3 minimum characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide a brand description!"],
    minlength: [
      10,
      "A description should have at least 10 minimum characters!",
    ],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Please provide a brand category!"],
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
  image: {
    type: String,
    required: [true, "Please provide a brand image!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
