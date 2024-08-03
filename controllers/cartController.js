const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getLoggedUserCart = catchAsync(async (req, res, next) => {});

const addProductToCart = catchAsync(async (req, res, next) => {
  const products = [];

  products.push({
    count: 1,
    product: req.body.productId,
  });

  const cart = await Cart.create({
    cartOwner: req.user._id,
    products,
  });

  await cart.populate({
    path: "products",

    populate: { path: "product", select: "-__v" },
  });

  console.log(cart);

  res.status(201).json({
    status: "success",
    data: {
      cart,
    },
  });
});

const updateProductCartQuantity = catchAsync(async (req, res, next) => {});
const removeSpecificCartItem = catchAsync(async (req, res, next) => {});
const clearUserCart = catchAsync(async (req, res, next) => {});

module.exports = {
  getLoggedUserCart,
  addProductToCart,
  updateProductCartQuantity,
  removeSpecificCartItem,
  clearUserCart,
};
