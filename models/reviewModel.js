const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "A product must have a review!"],
    minlength: [5, "Your review should be at least 5 characters"],
  },
  rating: {
    type: Number,
    min: [1, "The rating shouldn't! be less than 1 star!"],
    max: [5, "The rating shouldn't be more than 5 stars!"],
  },
  reactions: {
    type: String,
    enum: ["Like", "Dislike", "Love"],
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
