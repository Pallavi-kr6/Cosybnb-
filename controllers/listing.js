const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  console.log("🔥 /listings route hit");
  const listings = await Listing.find({});
  
  res.render("listings/index", { listings });
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

    res.render("listings/edit", { listing }); 
}

module.exports.UpdateListing = async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(id, listing, {
        new: true,
        runValidators: true
    });
   
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


module.exports.CreatedListing=async (req, res, next) => {
    const { listing } = req.body;

    if (!listing.image || !listing.image.url || listing.image.url.trim() === "") {
        listing.image = {
            filename: "default.jpg",
            url: "https://plus.unsplash.com/premium_photo-1748960861503-99b1f5412a81?q=80&w=1970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        };
    }

    const newListing = new Listing(listing);
    newListing.owner =req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/");
}