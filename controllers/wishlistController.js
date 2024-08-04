const Wishlist = require("../models/wishlistModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getLoggedUserWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({
    createdBy: { $eq: req.user._id },
  });

  if (!wishlist) {
    return next(
      new AppError(
        "You don't have any products in your wishlist till now! You can add some.",
        404
      )
    );
  }

  await wishlist.populate({
    path: "products",
    select: "-__v",
  });

  res.status(200).json({
    status: "success",
    count: wishlist.products.length,
    data: {
      products: wishlist.products,
    },
  });
});

const addProductToWishlist = catchAsync(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ createdBy: { $eq: req.user._id } });

  const isProductIdTheSame = wishlist?.products?.some(
    (productId) => productId == req.body.productId
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({
      products: [req.body.productId],
      createdBy: req.user._id,
    });
  } else if (isProductIdTheSame) {
    return next(
      new AppError("You've already added this product to your wishlist!", 400)
    );
  } else {
    wishlist.products.push(req.body.productId);
    await wishlist.save();
  }

  res.status(201).json({
    status: "success",
    message: "Successfully added your product to your wishlist 🎉",
    data: {
      products: wishlist.products,
    },
  });
});

const removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({
    createdBy: { $eq: req.user._id },
  });

  if (!wishlist) {
    return next(
      new AppError(
        "You don't have any products in your wishlist till now! You can add some.",
        404
      )
    );
  }

  const currentProductId = wishlist?.products?.findIndex(
    (productId) => productId.toString() === req.params.productId
  );

  wishlist.products = wishlist.products.filter(
    (productId) => productId != req.params.productId
  );
  await wishlist.save();

  if (currentProductId === -1) {
    return next(
      new AppError(
        "You've already deleted this product from your wishlist!",
        404
      )
    );
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
