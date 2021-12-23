const mongoose = require("mongoose");
const Mydonation = new mongoose.Schema({

    date:{
        type:String
    },
    userId:{
        type:String
    },
    cricket: {
        type: String
    },
    firstname: {
        type: String
    },
    fathername: {
        type: String
    },
 
    age: {
        type: String
    },
    qualification: {
        type: String
    },
    cnic: {
        type: String
    },
    business:{
        type:String
    },
   
    oaddress:{
        type:String
    },
    paddress:{
        type:String
    },
    caddress:{
        type:String
    },
    area:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    password:{
        type:String
    },
    policy:{
        type:String
    },
    imageUrl:{
        type:String
    },
    status:{
        type:String
    },

    amount:{
        type:String
    }
  
    
})

module.exports = mongoose.model("mydonation", Mydonation);