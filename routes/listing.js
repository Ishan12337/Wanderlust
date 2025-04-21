const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const flash = require("connect-flash");
const {isLoggedIn,isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

//router.route index&create
router
  .route("/")
  .get( wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing, 
     wrapAsync(listingController.createRoute)
   );

//new Route
router.get("/new",  isLoggedIn, listingController.new);

//router.route show & update & delete
router.route("/:id")
.get( wrapAsync(listingController.showRoute))
.put( isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateRoute))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));


 //Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editRoute));


module.exports = router;