const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.restrictTo("user"));

router
  .route("/")
  .get(wishlistController.getLoggedUserWishlist)
  .post(wishlistController.addProductToWishlist);

router.delete("/:id", wishlistController.removeProductFromWishlist);

module.exports = router;
