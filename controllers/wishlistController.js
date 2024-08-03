const Wishlist = require("../models/wishlistModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getLoggedUserWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.find({
    createdBy: { $eq: req.user._id },
  });

  const products = wishlist.map((el) => el.product);

  res.status(200).json({
    status: "success",
    count: wishlist.length,
    data: {
      products,
    },
  });
});

const addProductToWishlist = catchAsync(async (req, res, next) => {
  const product = await Wishlist.create({
    product: req.body.productId,
    createdBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

const removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const product = await Wishlist.findOneAndDelete({
    product: req.params.productId,
    createdBy: { $eq: req.user._id },
  });

  if (!product) {
    return next(new AppError("There is no product with that id!", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getLoggedUserWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
};
