const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middlewares/middlewares.js");
const reviewController = require("../controllers/review.controller.js");
const wrapAsync = require("../utils/wrapAsync.js");





//Review route validate lagana h
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//review DELETE route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);
module.exports = router;