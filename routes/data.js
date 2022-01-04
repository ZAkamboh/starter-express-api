const express = require("express");
const router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const membership = require('../models/membership');
const Mydonation = require('../models/mydonation');

const bcrypt = require("bcryptjs");


router.post('/signup', (req, res, next) => {


    membership.findOne({ mobile: req.body.mobile }).then(members => {

        if (!members) {
            const newmembership = new membership({
                cricket: req.body.cricket,
                firstname: req.body.firstname,
                fathername: req.body.fathername,
                age: req.body.age,
                qualification: req.body.qualification,
                cnic: req.body.cnic,
                business: req.body.business,
                oaddress: req.body.oaddress,
                paddress: req.body.paddress,
                caddress: req.body.caddress,
                area: req.body.area,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                policy: req.body.policy,
                imageUrl: req.body.imageUrl,
                status: req.body.status
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newmembership.password, salt, (err, hash) => {
                    if (err) return err;
                    newmembership.password = hash;
                    newmembership.save().then(response => {
                        if (response) {
                            res.send({ success: true, membership: response })
                        }
                        else {
                            res.send({ success: false, error: "Error in Creating membership" })
                        }
                    }).catch(err => {
                        console.log("bcrypt")
                        res.send({ success: false, error: "Something Bad Happened!" })
                    })

                });
            });
        }
        else {
            res.send({ success: false, error: `Mobile Number is already exist. آپ کی یہ ایی میل پہلے سے ریجسٹر ہے برائے مہربانی کسی اور ایی میل سے ممبرشپ حاصل کریں۔ ` })
        }
    });
})

router.post('/login', (req, res, next) => {
    var password = req.body.password;
    var mobile = req.body.mobile;

    membership.findOne({ mobile }).then(resp => {
        if (resp) {
            bcrypt.compare(password, resp.password, function (err, member) {
                if (member) {
                    res.send({ success: true, members: resp })
                }
                else {
                    res.send({ success: false, error: "Incorrect Password Entered" })
                }
            });
        }
        else {
            res.send({ success: false, error: "You Don't have any account please Become a member first" });
        }
    }).catch(err => {
        res.send({ success: false, error: "Something Bad Happened!" })
    })
})








router.post('/updatemember', (req, res) => {
    membership.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['status'] = 'approved';
        membership.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, })
            }
            else {
                res.send({ success: false, error: "data not updated" })
            }
        }).catch(err => {
            res.send({ success: false, error: "Something Bad Happened!" })
        })
    }).catch(err => {
        res.send({ success: false, error: "Something Bad Happened!" })
    })

})

router.get('/getAllMembers', (req, res) => {

    membership.find({}).then(allmembers => {
        if (allmembers) {
            res.send({ success: true, allmembers })

        }
        else {
            console.log("plz Become a member first");
        }
    }).catch(err => {
        console.log(err.message)
    })

})

router.post('/getUpdatedMembers', (req, res) => {


    membership.findOne({ userId: req.body._id }).then(updatedmember => {
        if (updatedmember) {
            res.send({ success: true, updatedmember })
        }
        else {
            console.log("plz Become a member first");
        }
    }).catch(err => {
        console.log(err.message)
    })

})


router.post('/getSearchMembers', (req, res) => {

    membership.find(req.body).then(searchMembers => {
        if (searchMembers) {
            res.send({ success: true, searchMembers })
        }
        else {
            console.log("No search member find");
        }
    }).catch(err => {
        console.log(err.message)
    })

})

router.post('/mydonation', (req, res) => {


    const newMydonation = new Mydonation({
        cricket: req.body.members.cricket,
        firstname: req.body.members.firstname,
        fathername: req.body.members.fathername,
        age: req.body.members.age,
        qualification: req.body.members.qualification,
        cnic: req.body.members.cnic,
        business: req.body.members.business,
        oaddress: req.body.members.oaddress,
        paddress: req.body.members.paddress,
        caddress: req.body.members.caddress,
        area: req.body.members.area,
        email: req.body.members.email,
        mobile: req.body.members.mobile,
        password: req.body.members.password,
        policy: req.body.members.policy,
        imageUrl: req.body.members.imageUrl,
        status: req.body.members.status,
        amount: req.body.amount,
        userId: req.body.userId,
        date: req.body.date
    });

    newMydonation.save().then((newres) => {
        res.send({ success: true, newres })

    }).catch((err) => {
        console.log(err)
    })

})

router.post('/getMydonation/:id', (req, res) => {


    Mydonation.find({ userId: req.params.id }).then(MEMBERDONATION => {
        if (MEMBERDONATION) {

            console.log("GET MEMBERS DONATIONS", MEMBERDONATION)
            res.send({ success: true, MEMBERDONATION })

        }
        else {
            console.log("No MEMBERDONATION");
        }
    }).catch(err => {
        console.log(err.message)
    })

})

router.post('/getmemberdonationadmin/:id', (req, res) => {


    Mydonation.find({ userId: req.params.id }).then(MEMBERDONATIONADMIN => {
        if (MEMBERDONATIONADMIN) {

            console.log("GET MEMBERS DONATIONS ADMIN", MEMBERDONATIONADMIN)
            res.send({ success: true, MEMBERDONATIONADMIN })

        }
        else {
            console.log("No MEMBERDONATIONADMIN");
        }
    }).catch(err => {
        console.log(err.message)
    })

})



module.exports = router;
