const Listing = require("../models/listing.js");
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require("../../schema.js")
const {reviewSchema} = require("../../schema.js");
const Review = require("../models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectURL
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must Logged in First!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You have not permitted to edit");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
        if (!review.author._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not author of this review!");
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
};

module.exports.validateListing = (req,res,next)=>{
   
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    if (req.body.review && req.body.review.rating) {
        req.body.review.rating = Number(req.body.review.rating);
    }
    
        const {error} = reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map(el=>el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        }
    };

    module.exports.isReviewAuthor = async(req,res, next)=>{
        let {id,reviewId} = req.params;
        let review = await Review.findById(reviewId);
        if(!review.author._id.equals(res.locals.currUser._id)){
            req.flash("error", "You are not author of this review!");
           return  res.redirect(`/listings/${id}`);
        }
        next();
};
