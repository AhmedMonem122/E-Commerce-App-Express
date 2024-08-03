const express = require("express");
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("user"));

router
  .route("/")
  .get(cartController.getLoggedUserCart)
  .post(cartController.addProductToCart)
  .delete(cartController.clearUserCart);

router
  .route("/:productId")
  .put(cartController.updateProductCartQuantity)
  .delete(cartController.removeSpecificCartItem);

module.exports = router;
