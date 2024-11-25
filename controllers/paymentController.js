const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Payment = require("../models/paymentModel");

const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (e) {
    return false;
  }
};

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

  if (!req.query.url || !validateUrl(req.query.url)) {
    return next(
      new AppError("Please provide a valid URL to continue your purchase.", 400)
    );
  }

  const line_items = cart.products.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.product.title,
          description: product.product.description,
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
    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

const createPaymentCheckout = catchAsync(async (session) => {
  const cartId = session.client_reference_id;

  const cart = await Cart.findById(cartId);
  const products = cart.products.map((product) => product.product);

  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items
    .map((item) => item.price_data.unit_amount / 100)
    .reduce((acc, amount) => amount + acc, 0);
  const amount = session.display_items
    .map((item) => item.quantity)
    .reduce((acc, count) => count + acc, 0);
  await Payment.create({ products, user, price, amount });
});

const webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createPaymentCheckout(event.data.object);

  res.status(200).json({ received: true });
};

module.exports = {
  createCheckoutSession,
  createPaymentCheckout,
  webhookCheckout,
};
