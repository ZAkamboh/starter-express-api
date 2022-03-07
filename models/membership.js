const mongoose = require("mongoose");
const membershipSchema = new mongoose.Schema({

    userId: {
        type: String
    },
    cricket: {
        type: String
    },
    firstname: {
        type: String,
        get: v => v.toLowerCase()
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
    business: {
        type: String
    },

    oaddress: {
        type: String
    },
    paddress: {
        type: String
    },
    caddress: {
        type: String
    },
    area: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    password: {
        type: String
    },
    policy: {
        type: String
    },
    imageUrl: {
        type: String
    },
    status: {
        type: String
    },
    activateStatus: {
        type: String
    },
    bloodgroup: {
        type: String
    },

    membershipcategory: {
        type: String
    },

    membershipfees: {
        type: Number
    },



    paidmembershipfees: {
        type: Number
    },

    paidmembershipfeestransactionid: {
        type: String
    },

    paidmembershipfeesdate: {
        type: String
    },
    paidmembershipfeesstatus: {
        type: String
    },
    registrationfees: {
        type: Number

    },
    paidregistrationfeesstatus: {
        type: String
    },

    paidregistraionfeesdate: {
        type: String
    },

    paidregistrationfeestransactionid: {
        type: String
    },

})

module.exports = mongoose.model("members", membershipSchema);