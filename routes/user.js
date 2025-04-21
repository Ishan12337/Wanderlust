const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


const userController = require("../controllers/users.js");

//router.route signup page
router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signupUser));

//router.route login page
router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
     passport.authenticate("local", {
        failureRedirect: '/login',
         failureFlash: true,
        }),
        userController.loginUser
    );

//logged out
router.get("/logout", userController.logoutUser)


module.exports = router;