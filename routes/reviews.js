const express = require("express");
const router = express.Router({mergeParams: true});
const ExpressError = require('../utils/ExpressError.js');
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middlewares.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");


//validate


//Review route validate lagana h
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//review DELETE route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);
module.exports = router;