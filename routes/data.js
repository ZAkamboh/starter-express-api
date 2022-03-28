const express = require("express");
const router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const membership = require('../models/membership');
const Mydonation = require('../models/mydonation');
const Postjob = require('../models/postjobs');
const AmountDeduct = require('./amountDeduct');
const AccountDeactivate = require('./accountDeactive');
const sendSMS = require('./sendSMS');
const reminderemail = require('./reminderEmail');
const deductAndZero = require('./deductandzero')

// const smsContacts = [
//     '923312380673',
//     '923087256653'
// ]

// smsContacts.forEach(contact => sendSMS(contact, 'I am Testing SMS Service'));

const bcrypt = require("bcryptjs");


var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secureConnection: false,
    service: 'gmail',
    secure: false,
    auth: {
        user: 'kambohwelfareanjumankarachi@gmail.com',
        pass: 'kambohwelfareanjumankarachi1818'
    }, tls: {
        rejectUnauthorized: false
    }
});








const todayDate = new Date().getDate();

function reminderMonthlymembershipFees() {
    membership.find().then(users => {
        users.forEach(user => {


            if (user.paidmembershipfees === 0 && user.status === "approved") {


                smsContacts = [
                    user.mobile
                ]


                smsContacts.forEach(contact => {
                    sendSMS(contact, `Dear ${user.firstname} ap ny is month ki monthly membership fees jama nai krwayi mehrbani farma kr membership fees jama krwayen otherwise ap ka account deactivate kr dia jaye ga.From Kamboh welfare anjuman karachi`)
                });

                console.log("Reminder msg successfuly send to member")

            }
            else {


            }


        });

    }).catch(err => {
        console.log("Data not updated")
    })
};



setInterval(() => {
    if (todayDate === 1) {
        reminderMonthlymembershipFees();
    }
}, 86400000)





function reminderMonthlymembershipFees2() {
    membership.find().then(users => {
        users.forEach(user => {


            if (user.paidmembershipfees < 0 && user.status === "approved") {


                smsContacts = [
                    user.mobile
                ]


                smsContacts.forEach(contact => {
                    sendSMS(contact, `Dear ${user.firstname} ap ki monthly membership fees 0 sy bhi km ho kr - ma chali gyi ha mehrbani farma kr apni pichli or is mahiney ki membership fees jama krwayen.From Kamboh welfare anjuman karachi`)
                });

                console.log("Reminder -msg successfuly send to member")

            }
            else {


            }


        });

    }).catch(err => {
        console.log("Data not updated")
    })
};



setInterval(() => {
    if (todayDate === 1) {
        reminderMonthlymembershipFees2();
    }
}, 86400000)




function Accountdeactivate() {
    membership.find().then(users => {
        users.forEach(user => {
            user['paidmembershipfees'] = user['paidmembershipfees'] - user['membershipfees'];
            membership.updateOne({ _id: user._id }, { $set: user }).then(updated => {
                if (updated) {
                    if (user.paidmembershipfees > 0 && user.status === "approved") {



                        smsContacts = [
                            user.mobile
                        ]
                        smsContacts.forEach(contact => {
                            sendSMS(contact, `Dear ${user.firstname} ap ki monthly membership fees ap ki advance baiji gyi monthly membership fees ma sy deduct kr di gyi ha deduct hony k bad ap ki fees ${user.paidmembershipfees} reh gyi ha.From Kamboh welfare anjuman karachi`)
                        });
                        console.log("Dedection msg successfuly send to member")

                    }


                    else if (user.paidmembershipfees === 0 && user.status === "approved") {


                        smsContacts = [
                            user.mobile
                        ]
                        smsContacts.forEach(contact => {
                            sendSMS(contact, `Dear ${user.firstname} ap ki is month ki membership fees deduct hony k bad baqaya fees 0 reh gyi ha mehrbani farma kr monthly membership fees update kren ta k agly month ap ka account deactivate naa ho.From Kamboh welfare anjuman karachi`)
                        });
                        console.log("Dedection but remaining fees zero msg successfuly send to member")
                    }
                    else {
                        user['activateStatus'] = 'deactivate'

                        // updated again after deactivate
                        user.status === "approved" &&
                            membership.updateOne({ _id: user._id }, { $set: user }).then(updatedwithdeactivate => {
                                if (updatedwithdeactivate) {
                                    console.log("account deactivated")


                                    smsContacts = [
                                        user.mobile
                                    ]
                                    smsContacts.forEach(contact => {
                                        sendSMS(contact, `Dear ${user.firstname} ap ka account monthly membership fees paid na hony ki waja sy deactivate kr dia gya ha mehrbani farma kr donate now ma monthly membership fees update kren ap ka account activate kr dia jaye ga.From Kamboh welfare anjuman karachi`)
                                    });

                                    console.log("Account Deactivate msg successfuly send to member")
                                }
                                else {
                                    console.log("data not updated")
                                }
                            }).catch(err => {
                                console.log("something bad happended")
                            })


                        // updated again after deactivate end

                    }
                }
                else {
                    console.log("Data not updated")
                }
            }).catch(err => {
                console.log("Data not updated")
            })
        });

    }).catch(err => {
        console.log("Data not updated")
    })
};




setInterval(() => {
    if (todayDate === 6) {
        Accountdeactivate();
    }
}, 86400000)








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
                status: req.body.status,
                bloodgroup: req.body.bloodgroup,
                activateStatus: req.body.activateStatus,
                membershipcategory: req.body.membershipcategory,
                membershipfees: req.body.membershipfees,

                paidmembershipfees: req.body.paidmembershipfees,
                paidmembershipfeestransactionid: req.body.paidmembershipfeestransactionid,
                paidmembershipfeesdate: req.body.paidmembershipfeesdate,
                paidmembershipfeesstatus: req.body.paidmembershipfeesstatus,
                registrationfees: req.body.registrationfees
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
            res.send({ success: false, error: `Mobile Number is already exist. آپ کا یہ نمبر پہلے سے ریجسٹر ہے براہِ مہربانی کسی دوسرے نمبر سے ممبر شپ حاصل کریں۔` })
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

router.post('/generatecode', (req, res, next) => {

    var mobile = req.body.mobile;
    var code = req.body.code;

  


    membership.findOne({ mobile: mobile }).then(member => {
        if (!member) {
            res.send({ success: false, error: "I think you enter wrong Mobile number" })

        }

        else {
            smsContacts = [
                member.mobile
            ]


            smsContacts.forEach(contact => {
                sendSMS(contact, `kamboh welfare anjuman kararchi Password Reset Code is : ${code}. From kamboh welfare anjuman kararchi`)
            });
            res.send({ success: true, })
          
        }




    }).catch(err => {
        res.send({ success: false, error: "Something Bad Happened!" })
    })





})

router.post('/forgot', (req, res, next) => {

    var password = req.body.password;
    var mobile = req.body.mobile;



    membership.findOne({ mobile: mobile }).then(member => {
        if (!member) {
            res.send({ success: false, error: "password not updated. I think you enter wrong Mobile number" })

        }

        else {
            var user = member;

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return err;
                    password = hash;
                    user['password'] = password;

                    membership.updateOne({ mobile: mobile }, { $set: user }).then(updated => {
                        if (updated) {
                            res.send({ success: true, })

                            smsContacts = [
                                user.mobile
                            ]


                            smsContacts.forEach(contact => {
                                sendSMS(contact, 'ap ka password successfully update kr dia gya ha. From kamboh welfare anjuman kararchi')
                            });


                        }
                        else {
                            res.send({ success: false, error: "password not updated. I think you enter wrong number" })
                        }
                    }).catch(err => {
                        res.send({ success: false, error: "Something Bad Happened!" })
                    })


                });
            });
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

                smsContacts = [
                    user.mobile
                ]


                smsContacts.forEach(contact => {
                    sendSMS(contact, 'ap ki membership request approved kr di gyi ha mehrbani farma kr website pr login kren or saholiat sy faida hasil kren.Note:membership form fill krty wqt jo number or password istimal kiya tha usi number or password ko login krty wqt istimal kren.From kamboh welfare anjuman karachi.')
                });


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


// status deactivate


router.post('/deactivate', (req, res) => {
    membership.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['activateStatus'] = 'deactivate';
        membership.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, })

                smsContacts = [
                    user.mobile
                ]


                smsContacts.forEach(contact => {
                    sendSMS(contact, 'ap ki membership deactivate krdi gyi ha mehrbani farma kr membership ki monthly fees update kren website ma login kren or donate now ma ja kr membership fees jama krwayen.From kamboh welfare anjuman karachi')
                });





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


// status deactivate end

// status activate 


router.post('/activate', (req, res) => {
    membership.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['activateStatus'] = 'activate';
        membership.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, })

                smsContacts = [
                    user.mobile
                ]


                smsContacts.forEach(contact => {
                    sendSMS(contact, 'ap ki membership activate krdi gyi ha mehrbani farma kr website ma login kren or membership ki facilities sy faida hasil kren shukria.From kamboh welfare anjuman karachi')
                });


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


// status activate end













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


    if (req.body.purpose === "Monthly Membership Fees") {

        membership.findOne({ _id: req.body.members._id }).then(member => {
            var user = member;
            user['paidmembershipfees'] = user['paidmembershipfees'] < 0 ? Number(req.body.amount) - (user['paidmembershipfees'] * -1) : user['paidmembershipfees'] + Number(req.body.amount);
            user['paidmembershipfeestransactionid'] = req.body.transactionid,
                user['paidmembershipfeesdate'] = req.body.date,
                user['paidmembershipfeesstatus'] = false,

                user['activateStatus'] = user['activateStatus'] === "deactivate" ? 'activate' : 'activate',




                membership.updateOne({ _id: req.body.members._id }, { $set: user }).then(updated => {
                    if (updated) {
                        res.send({ success: true, })


                        smsContacts = [
                            '03312380673',
                            '03126850002',
                            '03342161611',
                        ]


                        smsContacts.forEach(contact => {
                            sendSMS(contact, `Dear Admin ap ko ${req.body.members.firstname} ${req.body.members.fathername} ny ${req.body.amount} membership fees transfer ki ha mehrabnai farma kr admin panel mai ja k verify kren.From kamboh welfare anjuman karachi`)
                        });



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

    }

    else if (req.body.purpose === "registration fees") {

        membership.findOne({ _id: req.body.members._id }).then(member => {
            var user = member;
            user['registrationfees'] = req.body.amount;
            user['paidregistrationfeestransactionid'] = req.body.transactionid,
                user['paidregistraionfeesdate'] = req.body.date,
                user['paidregistrationfeesstatus'] = false,

                membership.updateOne({ _id: req.body.members._id }, { $set: user }).then(updated => {
                    if (updated) {
                        res.send({ success: true, })


                        smsContacts = [
                            '03312380673',
                            '03126850002',
                            '03342161611',

                        ]


                        smsContacts.forEach(contact => {
                            sendSMS(contact, `Dear Admin ap ko ${req.body.members.firstname} ${req.body.members.fathername} ny ${req.body.amount} Registration Fees transfer ki ha mehrabnai farma kr admin panel mai ja k verify kren.From kamboh welfare anjuman karachi`)
                        });


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

    }

    else {
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
            transactionid: req.body.transactionid,
            purpose: req.body.purpose,
            userId: req.body.userId,
            date: req.body.date,
            donationStatus: req.body.donationStatus,
            comment: req.body.comment,
            resgistrationfees: req.body.resgistrationfees

        });

        newMydonation.save().then((newres) => {
            res.send({ success: true, newres })

            smsContacts = [
                '03312380673',
                '03126850002',
                '03342161611',

            ]

            smsContacts.forEach(contact => {
                sendSMS(contact, `Dear Admin ap ko  ${req.body.members.firstname} ${req.body.members.fathername}  ny ${req.body.amount} Fund transfer kia ha mehrabnai farma kr admin panel mai ja k verify kren.From kamboh welfare anjuman karachi`)
            });




        }).catch((err) => {
            console.log(err)
        })

    }


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



router.post('/updatememberdonation', (req, res) => {
    Mydonation.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['donationStatus'] = 'approved';
        Mydonation.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, })


                smsContacts = [
                    user.mobile
                ]

                smsContacts.forEach(contact => {
                    sendSMS(contact, `Dear ${user.firstname} ${user.fathername} ap ny hamen RS:${user.amount} transfer kiya tha wo hamen masol hogya ha ap ka tawan ka behad shukria.From kamboh welfare anjuman karachi`)
                });
                console.log("donation verify sms successfully sender to member")


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


// verifypaidmembershipfeesstatus


router.post('/getmemberWithPaidMembershipStatus/:id', (req, res) => {


    membership.find({ _id: req.params.id }).then(getmemberWithPaidMembershipStatusVerified => {
        if (getmemberWithPaidMembershipStatusVerified) {

            res.send({ success: true, getmemberWithPaidMembershipStatusVerified })

        }
        else {
            console.log("No MEMBERDONATION");
        }
    }).catch(err => {
        console.log(err.message)
    })

})

router.post('/getmemberWithPaidMembershipStatusadmin/:id', (req, res) => {


    membership.find({ _id: req.params.id }).then(getmemberWithPaidMembershipStatus => {
        if (getmemberWithPaidMembershipStatus) {

            console.log("GET MEMBERS with paid membership status", getmemberWithPaidMembershipStatus)
            res.send({ success: true, getmemberWithPaidMembershipStatus })

        }
        else {
            console.log("No getmemberWithPaidMembershipStatus");
        }
    }).catch(err => {
        console.log(err.message)
    })

})








router.post('/verifypaidmembershipfeesstatus', (req, res) => {
    membership.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['paidmembershipfeesstatus'] = 'verified';
        membership.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, member })

                smsContacts = [
                    user.mobile
                ]

                smsContacts.forEach(contact => {
                    sendSMS(contact, `Dear ${user.firstname} ${user.fathername} ap ny hamen membership fees baiji thi jo k verify kr di gyi ha membership leny or fees pay krna ka bht shukria.From kamboh welfare anjuman karachi`)
                });

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
// verifypaidmembershipfeesstatus end



router.post('/verifypaidregistrationfeesstatus', (req, res) => {
    membership.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['paidregistrationfeesstatus'] = 'verified';
        membership.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, member })

                smsContacts = [
                    user.mobile
                ]

                smsContacts.forEach(contact => {
                    sendSMS(contact, `Dear ${user.firstname} ${user.fathername} ap ny hamen registration fees baiji thi jo k verify kr di gyi ha membership leny or fees pay krna ka bht shukria.From kamboh welfare anjuman karachi`)
                });


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







router.post('/sendmessage', (req, res) => {


    var specificcontacts = req.body.contacts
    var allcontacts = req.body.allemailcontacts

    console.log(allcontacts)
    console.log(specificcontacts)


    if (allcontacts) {

        res.send({ success: true })

        smsContacts =
            req.body.allemailcontacts;


        smsContacts.forEach(contact => {
            console.log("contact", contact);
            sendSMS(contact, `Alert Message Dear ${req.body.writemessagetext}.From kamboh welfare anjuman karachi`)
        });
    }

    else {

        res.send({ success: true })
        smsContacts =
            req.body.contacts


        smsContacts.forEach(contact => {
            sendSMS(contact, `Alert Message Dear ${req.body.writemessagetext}.From kamboh welfare anjuman karachi`)
        });

    }


})


router.post('/postjob', (req, res) => {


    const newPostjob = new Postjob({
        jobtitle: req.body.jobtitle,
        jobdesc: req.body.jobdesc,
        link: req.body.link,
        jobcontact: req.body.jobcontact,
        date: req.body.date,
        joboption: req.body.joboption
    });

    newPostjob.save().then((newres) => {
        res.send({ success: true, newres })


    }).catch((err) => {
        console.log(err)
    })




})

router.get('/getAlljobs', (req, res) => {
    Postjob.find({}).then(alljobs => {
        if (alljobs) {
            res.send({ success: true, alljobs })

        }
        else {
            console.log("job not found");
        }
    }).catch(err => {
        console.log(err.message)
    })

})

router.delete('/deleteMemberRequest/:id', (req, res) => {

    membership.remove({ _id: req.params.id }).then((success) => {
        res.send({ suc: true });
    })


})





module.exports = router;
