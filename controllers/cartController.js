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

const getLoggedUserCart = catchAsync(async (req, res, next) => {});

// Continue The Add Product To Cart Logic!!!!!!!!!
const addProductToCart = catchAsync(async (req, res, next) => {
  /*

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

*/

  let cart = await Cart.findOne({ cartOwner: { $eq: req.user._id } });

  // console.log("findOne cart: ", cart);

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

    console.log("cart inside if: ", cart);
  } else {
    await cartProductPopulate(cart);

    cart.products = cart.products.map((product) => {
      product.count = product.count + 1;
      product.price = product.product.price * product.count;
      return product;
    });

    calculateTotalCartPrice(cart);

    // cart.products.push(req.body.productId);
    await cart.save();
  }

  // const products = [];

  // products.push({
  //   count: 1,
  //   product: req.body.productId,
  // });

  //  cart = await Cart.create({
  //   cartOwner: req.user._id,
  //   products,
  // });

  // await cart.populate({
  //   path: "products",

  //   populate: { path: "product", select: "-__v" },
  // });

  // console.log("finalCart: ", cart);

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
