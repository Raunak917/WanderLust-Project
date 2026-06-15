const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.model.js");

require("dotenv").config();

const MONGO_URL = process.env.ATLASDB_URL;
main()
.then(async ()=>{
    console.log("connected to DB");

    await  initDB();
})
.catch((err)=>{
    console.log(err);
 });

 async function main(){
    await mongoose.connect(MONGO_URL);
 }

 const initDB = async ()=>{
    await Listing.deleteMany({});
    //console log for listings check
    const count = await Listing.countDocuments();
    console.log("Total Listings:", count);

    initData.data = initData.data.map((obj)=>({
      ...obj,
      owner: "69750d9bff5dad7dfac3e150",
    }));
    await Listing.insertMany(initData.data);
    //log the console
    const county = await Listing.countDocuments();
    console.log("Total Listings:", county);

    console.log("data was initialised");
 };