const express = require("express");
const router = express.Router({ mergeParams: true }); // Important to access :id from parent route
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');

const validateReview = (req, res, next) => {
  console.log("REQ.BODY inside validateReview:", req.body); // Log here
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// Create Review
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
   console.log("REQ.BODY:", req.body);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  const review = new Review(req.body.review);
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
