
const Listing = require("../models/listing.model");
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

    let { q } = req.query;

    let allListings;

    if(q){
        allListings = await Listing.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } }
            ]
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("index.ejs", { allListings });
};

module.exports.renderNewRoute = (req,res)=>{
   res.render("new.ejs");
};

//show
module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id)
     .populate({path:"reviews",
        populate:{
            path: "author",
        }
     })
     .populate("owner");
    
    if(!listing){
        req.flash("error", "Listing doesNot exists");
        return res.redirect("/listings");
    }
    res.render("show.ejs",{
        listing,
        title: listing.title,   //fix
        mapToken:process.env.MAP_TOKEN 
    });
};

// /posttt
module.exports.createListing = async(req,res,next)=>{
    
           if(!req.file){
    req.flash("error", "Please upload an image");
    return res.redirect("/listings/new");
       }
    
    //geocoding-------
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();
   
    if(response.body.features.length === 0){
    req.flash("error","Invalid location");
    return res.redirect("/listings/new");
    }
   
      
    const url = req.file.path;
    const filename = req.file.filename;
    // console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    
    newListing.geometry = response.body.features[0].geometry;

   
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");

};
//edit
module.exports.editListing = async (req, res, next) => {
    try {
        console.log("Reached edit controller");

        let { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not Found!");
            return res.redirect("/listings");
        }

        let orgImage = "";

        if (listing.image && listing.image.url) {
            orgImage = listing.image.url.replace(
                "/upload",
                "/upload/h_300,w_250"
            );
        }

        res.render("edit.ejs", {
            listing,
            orgImage,
            title: "Edit Listing"
        });

    } catch (err) {
        console.log("ERROR IN editListing:");
        console.log(err);
        next(err);
    }
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
    if(typeof req.file != "undefined"){
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
    res.redirect(`/listings`);
};

//need improvement in geocoding, and just beside block