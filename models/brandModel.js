const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a brand title!"],
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

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
