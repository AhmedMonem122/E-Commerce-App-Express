const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post("/checkout-session", paymentController.createCheckoutSession);

router.get("/myPayments", paymentController.getUserPayments);

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(paymentController.getAllPayments)
  .post(paymentController.addPayment);

router
  .route("/:id")
  .get(paymentController.getSpecificPayment)
  .patch(paymentController.updatePayment)
  .delete(paymentController.deletePayment);

module.exports = router;
