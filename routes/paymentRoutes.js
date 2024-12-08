const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/checkout-session",
  authController.protect,
  authController.restrictTo("user"),
  paymentController.createCheckoutSession
);

router.get(
  "/",
  authController.protect,
  authController.restrictTo("user"),
  paymentController.getUserPayments
);

module.exports = router;
