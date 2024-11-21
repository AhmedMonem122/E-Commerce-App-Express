const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModel");

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({
    cartOwner: { $eq: req.user._id },
  }).populate({
    path: "products",

    populate: { path: "product", select: "-__v" },
  });

  const line_items = cart.products.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.product.title,
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
    success_url: `${req.protocol}://${req.get("host")}/success`,
    cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
  });

  res.redirect(303, session.url);
});

module.exports = {
  createCheckoutSession,
};
