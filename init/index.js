const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to db!");
})
.catch((err) => {
    console.log(`error is occered ${err}`);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj,
          image: {
            url: obj.image,
            filename: String,
          },
     owner: "67fa9adb57ace8548c7071bd"

    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized!");
}

initDB();