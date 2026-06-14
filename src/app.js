if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// require("dotenv").config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('../src/utils/ExpressError.js');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Review = require("./models/review.js");



const dbUrl = process.env.ATLASDB_URL;

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
 }); 
async function main(){
    await mongoose.connect(dbUrl);
}
// app.get("/", (req, res)=>{
//     res.send("Hi I am root");
// });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret: process.env.SESSION_SECRET, // always from env
  resave: false,
  saveUninitialized: false, // ← also change this (explained below)
   store: MongoStore.create({ mongoUrl: dbUrl ,
    //   crypto: { secret: process.env.SESSION_SECRET },
     touchAfter: 24 * 3600,
    }), // ← add this
  cookie: {
    expires:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ← add this
    }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser = req.user;
console.log(res.locals.success);
next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "rk the boss"
//     });
//    let registerUser = await  User.register(fakeUser, "helloWorld" );
//    res.send(registerUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);




//otherwise site
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});


app.use((err, req, res, next) => {
    console.log("FULL ERROR STACK:", err.stack);  // ← add this line
    let { status = 500, message = "not found!!!" } = err;
    if (!res.headersSent) {
        res.status(status).send(message);
    }
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
