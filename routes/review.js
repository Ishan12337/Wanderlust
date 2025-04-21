const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync.js");
 const Review = require("../models/review.js");
 const Listing = require("../models/listing.js");
 const mongoose = require("mongoose");
 const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

 const reviewController = require("../controllers/reviews.js");


// Reviews
//post route for review
router.post("/:id/reviews", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));


//delete route for review 
 router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview),
);


module.exports = router;


