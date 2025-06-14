const express = require("express");
const router = express.Router({ mergeParams: true }); // Important to access :id from parent route
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { validateReview,isLoggedIn,isReviewAuthor } = require('../middleware.js');






// Create Review
router.post("/", isLoggedIn,validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
   console.log("REQ.BODY:", req.body);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  const review = new Review(req.body.review);
 review.author=req.user._id;
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

// Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
