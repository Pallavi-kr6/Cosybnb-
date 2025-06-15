const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.CreateReview = async (req, res) => {
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
}

module.exports.DeleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}