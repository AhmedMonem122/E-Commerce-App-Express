const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a product title!"],
      minlength: [3, "A title should have at least 3 minimum characters!"],
    },
    imageCover: {
      type: String,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description!"],
      minlength: [
        8,
        "A description should have at least 8 minimum characters!",
      ],
    },
    price: {
      type: Number,
      required: [true, "A title should have a price!"],
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/g, function (next) {
  this.populate({
    path: "brand",
    select: "-__v",
  });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
