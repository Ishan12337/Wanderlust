const Listing = require("../models/listing");


//home route
module.exports.index = async (req,res) => {      //home route we go home page
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});  
};


//new route
module.exports.new = (req,res) => {
    res.render("listings/new.ejs");
};


//show route
module.exports.showRoute = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");

   if(!listing){
    req.flash("error", "your listing is not exit!");
    res.redirect("/listings");

   }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


//create route
module.exports.createRoute = async (req,res,next) => { 

    const data = req.body.listing;

    
    if (typeof data.image === "string") {
        data.image = {
            url: data.image,
            filename: "", 
        };
    }

    const newListing = new Listing(data);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);


};


//edit route
module.exports.editRoute = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "your listing is not exit!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing}); 
};


//update route
module.exports.updateRoute = async(req,res) => {  

  let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // 👇 FIX THIS: Wrap image string into object
    listing.image = {
        url: req.body.listing.image
    };

    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};




//delete route
module.exports.deleteRoute = async(req,res) => {
    let {id} = req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);       //findOneAndDelete
    console.log(deletedListing);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");

};