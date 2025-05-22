const Review = require("../models/reviewModel");
const { getAll, getOne, updateOne, deleteOne } = require("./handlerFactory");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const setProductUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const addReview = catchAsync(async (req, res, next) => {
  let review;

  const currentUserReview = await Review.findOne({
    user: { $eq: req.user._id },
    product: { $eq: req.params.productId },
  });

  if (
    currentUserReview &&
    currentUserReview.review &&
    currentUserReview.rating &&
    currentUserReview.reactions
  ) {
    return next(
      new AppError("You've already left a review for this product!", 400)
    );
  }

  if (
    currentUserReview &&
    currentUserReview.review &&
    (!currentUserReview.rating || !currentUserReview.reactions)
  ) {
    currentUserReview.rating = req.body.rating;
    currentUserReview.reactions = req.body.reactions;
    await currentUserReview.save();
    review = currentUserReview;
  } else {
    review = await Review.create(req.body);
  }

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});

const getAllReviews = getAll(Review);
const getReview = getOne(Review);
const checkReviewOwnership = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  if (review.user._id.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only modify your own reviews", 403));
  }

  next();
});
const updateReview = [checkReviewOwnership, updateOne(Review)];
const deleteReview = [checkReviewOwnership, deleteOne(Review)];

module.exports = {
  setProductUserIds,
  getAllReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  checkReviewOwnership,
};
