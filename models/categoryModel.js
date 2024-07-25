const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a category title!"],
    minlength: [3, "A title should have at least 3 minimum characters!"],
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
