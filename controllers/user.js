const User = require("../models/user.js");
module.exports.getUser = (req,res)=>{
    res.render("../users/signup.ejs");
};

module.exports.getSaveData = async (req, res, next) => {
    let { username, email, password } = req.body;
    
    let newUser;
    try {
        newUser = new User({ email, username });
        newUser = await User.register(newUser, password);
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }

    // req.login is outside try/catch — it has its own callback for errors
    req.login(newUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "WanderLust welcomes You!");
        res.redirect("/listings");
    });
};
 module.exports.getLogin = (req,res)=>{
    res.render("../users/login.ejs");
 };
 module.exports.postLogin = async(req,res)=>{
        // res.send("Welcome to WanderLust! You r logged in :-)");
        req.flash("success", "Welcome to WanderLust! You r logged in");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    };

    module.exports.getLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out now!");
        res.redirect("/listings");
    });
};