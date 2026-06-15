const express = require("express");
const router = express.Router();

const {isLoggedIn, isOwner, validateListing} = require("../middlewares/middlewares.js");
const ListingController = require("../controllers/listing.controller.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer');
const {storage} = require("../config/cloudConfig.js");
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {

        if(
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg"
        ){
            cb(null,true);
        } else{
            cb(new Error("Only image files are allowed"));
        }

    }
});

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