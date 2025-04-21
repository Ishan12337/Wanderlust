const { default: mongoose } = require("mongoose");
const Listing = require("../models/listing");
const Review = require("../models/review");


//create review
module.exports.createReview = async (req, res) => {   
    const {id} = req.params;
    const idString = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(idString)) {
        return res.status(400).send("Invalid ID format");
      }   
   
  
    try {
      let listing = await Listing.findById(req.params.id);
      
      if (!listing) {
        return res.status(404).send("Listing not found");
      }
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
       // console.log(newReview);
      await newReview.save();
  
      listing.reviews.push(newReview._id); // Store review ID in Listing
      await listing.save();
  
      res.redirect(`/listings/${listing._id}`);
      
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };


  //delete review
module.exports.deleteReview = async(req,res) => {    
      let {id,reviewId} = req.params;

      await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
      await Review.findByIdAndDelete(reviewId);

      res.redirect(`/listings/${id}`);
 };