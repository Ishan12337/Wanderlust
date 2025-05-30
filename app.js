if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");            //ejs mate is a boiler plate to use same as many pages
 const ExpressError= require("./utils/ExpressError.js");

 const session = require("express-session");
 const MongoStore = require('connect-mongo');
 const flash = require("connect-flash");

 const passport = require("passport");
 const LocalStrategy = require("passport-local");
 const User = require("./models/user.js");


 const listingRouter = require("./routes/listing.js");
 const reviewRouter = require("./routes/review.js");
 const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;



main()
.then(() => {
    console.log("connected to db!");
})
.catch((err) => {
    console.log(`error is occered ${err}`);
});


async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/listings");  // render a homepage
});

app.get("/", (req, res) => {
    res.render("home");
});

// app.get("/", (req, res) => {
//     res.render("home");
// });
  





const store = MongoStore.create({
    mongoUrl: dbUrl,  //MONGO_URL
    crypto:{
         secret : process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("Error in mongo session store", err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    Cookie: {
        expires: Date.now + 7*24*60*60*1000,    //()
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());



  app.use((req, res, next) => {
    res.locals.currUser = req.user || null;  // Setting currUser globally
    next();
});




//   app.use((req,res,next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user || null;
//     next();
// });

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




app.use("/listings", listingRouter);  //listingRouter
app.use("/listings", reviewRouter);   //reviewRouter   
app.use("/", userRouter);


 

app.all("*",(req,res,next) => {
    next(new ExpressError(404, "page not found!"));
});

app.use((err,req,res,next) => {
     let{statusCode = 500,message = "something want wrong!"} = err;
      res.status(statusCode).render("error.ejs", {message});
     
});

app.listen(8080,() => {
    console.log("server is listing to port 8080");
});
