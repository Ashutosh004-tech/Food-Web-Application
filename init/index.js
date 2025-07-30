const mongoose = require("mongoose");
const initData = require("./initialData.js");
const Item = require("../models/item.js");
const Mongo_URL = "mongodb://127.0.0.1:27017/BiriyaniByte";

main().then(() => {
    console.log("Connected");
}).catch(err =>{
    console.log(err);
});

async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB = async ()=>{
    await Item.deleteMany({});
    await Item.insertMany(initData.data);
    console.log("Data was Intialised");
};

initDB();