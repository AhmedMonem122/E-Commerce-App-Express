const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const getAllProductReviews = catchAsync(async (req, res, next) => {});

module.exports = {
  getAllProductReviews,
};
