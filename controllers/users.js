const User = require("../models/user.js");

//signup page
module.exports.renderSignup = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.signupUser = async(req,res) =>{

    try{
        let {username,email,password} = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
       if(err) {
        return next(err);
       }
       req.flash("success", " welcome to wanderlust!");
        res.redirect("/listings");
    
    })
       
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   

  };

  //login page

  module.exports.renderLogin = (req,res) =>{
    res.render("users/login.ejs");
 };

 module.exports.loginUser = async(req,res) =>{
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);    // req.session.redirectUrl
};

//logout page
module.exports.logoutUser = (req,res, next) =>{
    req.logout((err) =>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
};