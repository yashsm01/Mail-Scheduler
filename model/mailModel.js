const mongoose = require("mongoose");
const mail = mongoose.Schema({
    Email: {type:String,require:true}, 
    Subject: {type:String,require:true},
    Message: {type:String,require:true},
    Time: {type:String,require:true}
},
{timestamps: true});


module.exports =  mongoose.model('Mail',mail);