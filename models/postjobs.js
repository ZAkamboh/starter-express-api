const mongoose = require("mongoose");
const Postjob = new mongoose.Schema({

    date:{
        type:String
    },
    jobtitle:{
        type:String
    },
    jobdesc: {
        type: String
    },
    link: {
        type: String
    },
    jobcontact: {
        type: String
    },

    joboption:{
        type: String
    }
 
 

    
})

module.exports = mongoose.model("jobs", Postjob);