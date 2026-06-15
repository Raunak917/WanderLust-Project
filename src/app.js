if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

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
const User = require("./models/user.model.js");




const dbUrl = process.env.ATLASDB_URL;

//getting all routes...

const listingRouter = require("./routes/listing.route.js");
const reviewRouter = require("./routes/review.route.js");
const userRouter = require("./routes/user.route.js");


mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected to DB");
    console.log(mongoose.connection.host);
})
.catch(err=>{
    console.log(err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "../public")));


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


//custom error handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;

  res.status(status).render("error.ejs", {
    status,
    message,
  });
});


app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
