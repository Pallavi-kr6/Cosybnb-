const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const {isLoggedIn,isOwner,validateListing }= require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage})
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.CreatedListing)
  );

//CREATE NEW ROUTE
router.get('/new' ,isLoggedIn,ListingController.renderNewForm)

router
 .route("/:id")
  .get( wrapAsync(ListingController.ShowListing ))
  .put(isLoggedIn ,isOwner, validateListing, wrapAsync(ListingController.UpdateListing ))
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn , isOwner,wrapAsync(ListingController.EditListing));


module.exports = router;