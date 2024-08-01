const Wishlist = require("../models/wishlistModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

///////////////SOLVE Wishlist Account BUG!!!!!/////////////////////

const getLoggedUserWishlist = catchAsync(async (req, res, next) => {
  const currentUser = User.findById(req.user._id);

  if (currentUser) {
    const products = await Wishlist.find();

    res.status(200).json({
      status: "success",
      count: products.length,
      data: {
        products,
      },
    });
  }
});

const addProductToWishlist = catchAsync(async (req, res, next) => {
  const currentUser = User.findById(req.user._id);

  if (currentUser) {
    const product = await Wishlist.create({
      product: req.body.productId,
    });

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  }
});

const removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const product = await Wishlist.findOneAndDelete({ product: req.params.id });

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
