const mongoose = require("mongoose");
const Review = require("./review.js");
const { types } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
   title: {
    type: String,
    required: true,
   },
   description: String,
   image: {
      url : {
    type: String,
    default:  "https://media.istockphoto.com/id/1446291342/photo/san-juan-mountain-range-in-silverton-colorado-summer-morning-point-of-view-from-empty-highway.webp?a=1&b=1&s=612x612&w=0&k=20&c=I662eQZo9unpKWNEG7ftqd02gYAARxHUsDBLLDiH8Iw=",
    set: (v) => 
   !v || v.trim() === "" ? "https://media.istockphoto.com/id/1446291342/photo/san-juan-mountain-range-in-silverton-colorado-summer-morning-point-of-view-from-empty-highway.webp?a=1&b=1&s=612x612&w=0&k=20&c=I662eQZo9unpKWNEG7ftqd02gYAARxHUsDBLLDiH8Iw="
    : v,
   },
   filename: String,
  },
   price: Number,
   location: String,
   country: String,
   reviews : [
      {
         type: Schema.Types.ObjectId,      
         ref: "Review",
      },
   ],
    owner: {  
      type: Schema.Types.ObjectId,
      ref: "User",
     },

});

listingSchema.post("findOneAndDelete", async (listing) => {
   if(listing) {
   await Review.deleteMany({_id: {$in: listing.reviews }});
   }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;