const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a category title!"],
    minlength: [3, "A title should have at least 3 minimum characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide a category description!"],
    minlength: [8, "A description should have at least 8 minimum characters!"],
  },
  brands: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
  ],
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
  image: {
    type: String,
    required: [true, "Please provide a category image!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
