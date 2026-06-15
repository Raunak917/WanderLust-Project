const express = require("express");
const router = express.Router({mergeParams: true});

const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/middlewares.js");
const userController = require("../controllers/user.controller.js");
const wrapAsync = require("../utils/wrapAsync.js");

//route for signup page get
router.route("/signup")
.get(userController.getUser)
.post(wrapAsync( userController.getSaveData));

router.route("/login")
.get(userController.getLogin)
.post(saveRedirectUrl,
    passport.authenticate("local", {
     failureRedirect: "/login",
    failureFlash: true,
     }),
    wrapAsync(userController.postLogin)
    
 );

router.get("/logout", userController.getLogout);

module.exports = router;