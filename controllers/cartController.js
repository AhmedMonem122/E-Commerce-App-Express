const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const cartProductPopulate = async (cart) => {
  await cart.populate({
    path: "products",

    populate: { path: "product", select: "-__v" },
  });
};

const calculateTotalCartPrice = (cart) => {
  cart.totalCartPrice = cart.products.reduce(
    (acc, product) => product.price + acc,
    0
  );
};

const getLoggedUserCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    cartOwner: { $eq: req.user._id },
  });

  if (!cart) {
    return next(
      new AppError(
        "You don't have any products in your cart till now! You can add some.",
        404
      )
    );
  }

  await cartProductPopulate(cart);

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.products.length,
    cartId: cart._id,
    data: {
      cart,
    },
  });
});

const addProductToCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ cartOwner: { $eq: req.user._id } });

  const isProductIdTheSame = cart?.products?.some(
    (product) => product.product._id.toString() === req.body.productId
  );

  if (!cart) {
    cart = await Cart.create({
      products: [
        {
          count: 1,
          product: req.body.productId,
        },
      ],
      cartOwner: req.user._id,
    });

    await cartProductPopulate(cart);

    cart.products = cart.products.map((product) => {
      product.price = product.product.price * product.count;
      return product;
    });

    calculateTotalCartPrice(cart);

    await cart.save();
  } else if (!isProductIdTheSame) {
    cart.products.push({
      count: 1,
      product: req.body.productId,
    });

    await cart.save();

    await cartProductPopulate(cart);

    cart.products = cart.products.map((product) => {
      product.price = product.product.price * product.count;
      return product;
    });

    calculateTotalCartPrice(cart);

    await cart.save();
  } else {
    await cartProductPopulate(cart);

    cart.products = cart.products.map((product) => {
      if (product.product._id.toString() === req.body.productId) {
        product.count = product.count + 1;
        product.price = product.product.price * product.count;
        return product;
      }

      return product;
    });

    calculateTotalCartPrice(cart);

    await cart.save();
  }

  res.status(201).json({
    status: "success",
    numOfCartItems: cart.products.length,
    cartId: cart._id,
    data: {
      cart,
    },
  });
});

const updateProductCartQuantity = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    cartOwner: { $eq: req.user._id },
  });

  await cartProductPopulate(cart);

  cart.products = cart.products.map((product) => {
    if (product.product._id.toString() === req.params.productId) {
      product.count = req.body.count;
      product.price = product.product.price * product.count;
      return product;
    }

    return product;
  });

  calculateTotalCartPrice(cart);

  cart.updatedAt = Date.now();

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.products.length,
    cartId: cart._id,
    data: {
      cart,
    },
  });
});

const removeSpecificCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    cartOwner: { $eq: req.user._id },
  });

  cart.products = cart.products.filter(
    (product) => product.product._id.toString() !== req.params.productId
  );

  calculateTotalCartPrice(cart);

  cart.updatedAt = Date.now();

  await cart.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const clearUserCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({
    cartOwner: { $eq: req.user._id },
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getLoggedUserCart,
  addProductToCart,
  updateProductCartQuantity,
  removeSpecificCartItem,
  clearUserCart,
};
