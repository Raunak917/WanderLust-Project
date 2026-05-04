const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js");
const ListingController = require("../controllers/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,
    
     upload.single("listing[image][url]"),
      validateListing,
     wrapAsync(ListingController.createListing)
      );

//new route
router.get("/new",isLoggedIn,wrapAsync(ListingController.renderNewRoute) );

router.route("/:id")
.get(wrapAsync(ListingController. showListing) )
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing, 
    wrapAsync(ListingController.updateListing)
)
.delete(isLoggedIn,
    isOwner,
    wrapAsync(ListingController.destroyListing)
    );

//edit route
router.get("/:id/edit",isLoggedIn,isOwner , wrapAsync(ListingController.editListing));

module.exports = router;