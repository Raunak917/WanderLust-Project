const Listing = require("../models/listing.model.js");
const Review = require("../models/review.model.js");


//create reviews

module.exports.createReview = async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview =     async(req,res)=>{
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};