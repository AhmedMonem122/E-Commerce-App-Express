const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModel");
const Payment = require("../models/paymentModel");
const handlerFactory = require("./handlerFactory");

const validateUrl = (url) => {
  const urlPattern = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/[^\s]*)?$/i;
  return urlPattern.test(url);
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

  if (
    !req.body?.shippingAddress &&
    !req.body?.shippingAddress?.details &&
    !req.body?.shippingAddress?.phone &&
    !req.body?.shippingAddress?.city
  ) {
    return next(
      new AppError(
        "Please provide a shipping address to continue your purchase.",
        400
      )
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
    metadata: { shippingAddress: JSON.stringify(req.body.shippingAddress) },
  });

  res.status(200).json({
    status: "success",
    session,
  });
});

const createPaymentCheckout = async (session) => {
  const cartId = session.client_reference_id;
  const cart = await Cart.findById(cartId);
  // const products = cart.products.map((product) => product.product);
  const user = cart.cartOwner;
  const price = cart.totalCartPrice;
  const amount = cart.products
    .map((item) => item.count)
    .reduce((acc, count) => count + acc, 0);
  const shippingAddress = JSON.parse(session.metadata.shippingAddress);
  await Payment.create({
    products: cart.products,
    user,
    price,
    amount,
    shippingAddress,
  });

  await Cart.findByIdAndDelete(cartId);
};

const webhookCheckout = async (req, res, next) => {
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
    await createPaymentCheckout(event.data.object);

  res.status(200).json({ received: true });
};

const getUserPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ user: req.user._id });
  res.status(200).json({
    status: "success",
    results: payments.length,
    data: {
      payments,
    },
  });
});

const getAllPayments = handlerFactory.getAll(Payment);
const getSpecificPayment = handlerFactory.getOne(Payment);
const addPayment = handlerFactory.addOne(Payment);
const updatePayment = handlerFactory.updateOne(Payment);
const deletePayment = handlerFactory.deleteOne(Payment);

module.exports = {
  createCheckoutSession,
  webhookCheckout,
  getUserPayments,
  getAllPayments,
  getSpecificPayment,
  addPayment,
  updatePayment,
  deletePayment,
};
