
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;


if (!mapToken) {
    throw new Error("MAP_TOKEN is not set in environment variables");
}
const geocodingClient = mbxGeocoding({
  accessToken: mapToken,
});

//index
module.exports.index = async(req,res)=>{
     const allListings = await Listing.find({});
        // console.log(res);
        res.render("index.ejs", {allListings});

};

module.exports.renderNewRoute = async(req,res)=>{
   
    
    res.render("new.ejs");

};
//show
module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(req.params.id)
     .populate({path:"reviews",
        populate:{
            path: "author",
        }
     })
     .populate("owner");
    if(!listing){
        req.flash("error", "Listing doesNot exists");
        res.redirect("/listings");
    }
    res.render("show.ejs",{listing});
};

// /posttt
module.exports.createListing = async(req,res,next)=>{
    try{
            if (
      !req.body.listing.image ||
      !req.body.listing.image.url ||
      req.body.listing.image.url.trim() === ""
    ) {
      req.body.listing.image = {
        url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        filename: "listingimage"
      };
    }
    //geocoding-------
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();
    
   
      
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    
    newListing.geometry = response.body.features[0].geometry;
    let savedListings = await newListing.save();
    console.log(savedListings);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    }catch(err){
        next(err);
    }
};
//edit
module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash("error", "Listing not Found!");
         res.render("edit.ejs", {listing});
    }

    let orgImage = listing.image.url;
orgImage = orgImage.replace("/upload", "/upload/h_300,w_250");
res.render("edit.ejs", {listing,orgImage});
   
};





//update
module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
//       if (
//     !req.body.listing.image ||
//     !req.body.listing.image.url ||
//     req.body.listing.image.url.trim() === ""
//   ) {
//     req.body.listing.image = undefined; // keep old image
//   }
    
    let listing = await Listing.findByIdAndUpdate(req.params.id, {...req.body.listing },{runValidators: true});
    if(typeof req.file != undefined){
     let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${req.params.id}`);
};
//destroy listing
module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};