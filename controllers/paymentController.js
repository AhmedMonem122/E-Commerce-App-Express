const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModel");
const Payment = require("../models/paymentModel");

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    cartOwner: { $eq: req.user._id },
  }).populate({
    path: "products",

    populate: { path: "product", select: "-__v" },
  });

  if (!cart) {
    return next(
      new AppError(
        "You don't have any products in your cart till now! Please add some to continue your purchase.",
        404
      )
    );
  }

  if (!req.query.url) {
    return next(
      new AppError("Please provide a valid url to continue your purchase.", 404)
    );
  }

  const line_items = cart.products.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.product.title,
          images: [product.product.imageCover],
        },
        unit_amount: product.product.price * 100,
      },
      quantity: product.count,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${req.query.url}/allOrders`,
    cancel_url: `${req.query.url}/`,
  });

  console.log("session: ", session);

  // req.session = session;
  // req.cart = cart;

  res.redirect(303, session.url);

  next();

  // res.status(200).json({
  //   status: "success",
  //   session,
  // });
});

const createPaymentCheckout = catchAsync(async (req, res, next) => {
  // if (req.session.payment_status === "unpaid") return next();
  // await Payment.create({
  //   products: req.cart.products.map((product) => product.product),
  //   user: req.user._id,
  //   price: req.cart.totalCartPrice,
  //   amount: req.cart.products
  //     .map((product) => product.count)
  //     .reduce((acc, count) => count + acc, 0),
  // });
  // console.log(await stripe.customerSessions);
});

module.exports = {
  createCheckoutSession,
  createPaymentCheckout,
};
