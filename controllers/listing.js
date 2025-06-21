const Listing = require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});




module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  if (search) {
    const regex = new RegExp(search, 'i'); // 'i' = case-insensitive
    query.title = regex;
  }

  if (category && category.trim() !== "") {
    query.category = category.trim(); // make sure to clean whitespace
  }

  const listings = await Listing.find(query);

  res.render("listings/index", { listings, search, category });
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new");
};

module.exports.ShowListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"  // ✅ populate author inside each review
            }
        })
        .populate("owner"); // ✅ this is fine because owner *is* in Listing schema

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/"); 
    }

    res.render("listings/show", { listing });
}

module.exports.EditListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit", { listing }); 
}

module.exports.UpdateListing = async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
        new: true,
        runValidators: true
    });
    if(typeof req.file!=="undefined"){
   let url=req.file.path;
    let filename=req.file.filename;
    listing.image = {url,filename};
    }
     req.flash("success","Listing Edited!");
    res.redirect(`/listings/${updatedListing._id}`);
}

module.exports.destroyListing = async (req, res) => {
  console.log("Delete route hit for ID:", req.params.id);
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    console.log("Listing not found");
    return res.redirect('/'); // Or handle with error message
  }
  await Listing.findByIdAndDelete(req.params.id);
   req.flash("success","Listing Deleted!");
  console.log("Listing deleted");
  res.redirect('/');
}


module.exports.CreatedListing = async (req, res, next) => {
    try {
        const geoResponse = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();

        const features = geoResponse.body.features;

        if (!features || features.length === 0) {
            req.flash("error", "Could not find location. Please enter a valid location.");
            return res.redirect("back");
        }

        const geometry = features[0].geometry;

        let url = req.file?.path;
        let filename = req.file?.filename;
        const { listing } = req.body;

        // fallback image
        if (!listing.image || !listing.image.url || listing.image.url.trim() === "") {
            listing.image = {
                filename: "default.jpg",
                url: "https://plus.unsplash.com/premium_photo-1748960861503-99b1f5412a81?q=80&w=1970&auto=format&fit=crop"
            };
        }

        const newListing = new Listing(listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = geometry;

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/");
    } catch (err) {
        console.error("Error creating listing:", err);
        req.flash("error", "Something went wrong while creating the listing.");
        res.redirect("back");
    }
};
