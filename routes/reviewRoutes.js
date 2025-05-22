const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.checkReviewOwnership,
    reviewController.setProductUserIds,
    reviewController.addReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.checkReviewOwnership,
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.checkReviewOwnership,
    reviewController.deleteReview
  );

module.exports = router;
