const express = require("express");
const router = express.Router({ mergeParams: true }); // Important to access :id from parent route
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { validateReview,isLoggedIn,isReviewAuthor } = require('../middleware.js');
const ReviewController = require("../controllers/review.js");





// Create Review
router.post("/", isLoggedIn,validateReview, wrapAsync(ReviewController.CreateReview));

// Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(ReviewController.DeleteReview));

module.exports = router;
