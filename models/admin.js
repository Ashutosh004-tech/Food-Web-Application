
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = new Schema ({
    shopName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required: true,
    },
    mobileNo:{
        type:Number,
        required:true,
    },
});


adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);