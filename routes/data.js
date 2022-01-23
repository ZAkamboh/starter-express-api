const express = require("express");
const router = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const membership = require('../models/membership');
const Mydonation = require('../models/mydonation');
const Postjob = require('../models/postjobs');


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
                bloodgroup:req.body.bloodgroup
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








router.post('/updatemember', (req, res) => {
    membership.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['status'] = 'approved';
        membership.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, })

                var mailOptions = {
                    from: 'kambohwelfareanjumankarachi@gmail.com',
                    to: user.email,
                    subject: 'Membership confirmation Email',
                    html: `
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
    <style>
        body,
        html {
            padding: 0;
            margin: 0;
        }

        sup {
            font-size: 6px;
        }

        @media screen and (max-width:600px) {
            table {
                width: 100% !important;
            }
            .parentDiv {
                width: 100% !important;
                padding: 0 !important;
            }
            .bottomContent{
                padding:0px 10px;
            }
        }
    </style>
</head>
    <body style="display:flex;justify-content:center;">
<div class="parentDiv" style="width:100%;background:#F3F7FA;display:flex;flex-direction:column;align-items:center;padding:0px 20px;">
<div style="padding:15px 0px;font-size:40px;color:#E70030;font-family:Roboto;font-weight:bold">
    <svg id="Group_1778" data-name="Group 1778" xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewbox="0 0 115.818 22.742">
        <g id="Group_2" data-name="Group 2">
            <path id="Path_4" data-name="Path 4" d="M1100.989,1001.741a2.246,2.246,0,1,1,2.259,2.234A2.206,2.206,0,0,1,1100.989,1001.741Zm.337,16.742V1005.32h3.771v13.162Z" transform="translate(-1100.989 -999.507)" fill="#e70030"/>
            <path id="Path_5" data-name="Path 5" d="M1121.381,1011.932a6.58,6.58,0,0,1-6.557,6.917,4.967,4.967,0,0,1-3.939-1.8v1.465h-3.65v-18.279H1111v6.414a5.065,5.065,0,0,1,3.819-1.633A6.594,6.594,0,0,1,1121.381,1011.932Zm-3.843-.024a3.3,3.3,0,0,0-3.339-3.435,3.461,3.461,0,1,0,3.339,3.435Z" transform="translate(-1101.252 -999.538)" fill="#e70030"/>
            <path id="Path_6" data-name="Path 6" d="M1136.157,1013.415h-9.681a3.363,3.363,0,0,0,3.579,2.474,7.9,7.9,0,0,0,4.107-1.273l1.49,2.57a9.731,9.731,0,0,1-5.765,1.826c-4.923,0-7.206-3.315-7.206-6.893a6.647,6.647,0,0,1,6.942-6.894,6.263,6.263,0,0,1,6.653,6.605A11.78,11.78,0,0,1,1136.157,1013.415Zm-9.7-2.69h6.2a2.965,2.965,0,0,0-3.026-2.45C1128.086,1008.275,1126.452,1010.725,1126.452,1010.725Z" transform="translate(-1101.904 -999.748)" fill="#e70030"/>
            <path id="Path_7" data-name="Path 7" d="M1145.33,1018.738l-2.282-4.107-2.426,4.107h-4.3l4.252-6.677-3.771-6.485h4.3l2.017,3.843,2.21-3.843h4.228l-4.011,6.557,4.131,6.605Z" transform="translate(-1102.479 -999.763)" fill="#e70030"/>
            <path id="Path_8" data-name="Path 8" d="M1150.467,1017.421a2.1,2.1,0,0,1,4.2,0,2.1,2.1,0,1,1-4.2,0Z" transform="translate(-1103.075 -1000.174)" fill="#e70030"/>
        </g>
        <path id="Path_1768" data-name="Path 1768" d="M11.022-10.032a5.159,5.159,0,0,0-4.2-2.024A5.608,5.608,0,0,0,2.6-10.318,5.956,5.956,0,0,0,.924-5.962,6.29,6.29,0,0,0,2.6-1.5,5.566,5.566,0,0,0,6.82.286a5.151,5.151,0,0,0,4.2-1.98V0h1.892V-11.77H11.022ZM11.176-5.9A4.508,4.508,0,0,1,10.01-2.772,3.871,3.871,0,0,1,7.018-1.518,3.871,3.871,0,0,1,4.026-2.772,4.56,4.56,0,0,1,2.9-5.874a4.482,4.482,0,0,1,1.122-3.1,3.815,3.815,0,0,1,2.992-1.276A3.815,3.815,0,0,1,10.01-8.976,4.4,4.4,0,0,1,11.176-5.9ZM24.728-10.23a5.128,5.128,0,0,0-4.092-1.826,5.774,5.774,0,0,0-4.268,1.738,5.823,5.823,0,0,0-1.738,4.29,5.977,5.977,0,0,0,1.694,4.312A5.608,5.608,0,0,0,20.548.022a5.225,5.225,0,0,0,4.18-1.848v.968A3.83,3.83,0,0,1,23.54,2.068a4.238,4.238,0,0,1-3.124,1.144,6.927,6.927,0,0,1-4.2-1.43l-.946,1.562a8.556,8.556,0,0,0,5.148,1.65A6.147,6.147,0,0,0,24.97,3.322,6.036,6.036,0,0,0,26.686-1.21V-11.77H24.728Zm-3.982-.044a3.882,3.882,0,0,1,2.948,1.21,4.182,4.182,0,0,1,1.188,3.036A4.233,4.233,0,0,1,23.694-2.97a3.882,3.882,0,0,1-2.948,1.21,3.964,3.964,0,0,1-2.97-1.21A4.272,4.272,0,0,1,16.61-6.028a4.255,4.255,0,0,1,1.166-3.036A3.9,3.9,0,0,1,20.746-10.274ZM40-6.094a5.956,5.956,0,0,0-1.584-4.356,5.453,5.453,0,0,0-4.07-1.606,5.605,5.605,0,0,0-4.268,1.738,6.135,6.135,0,0,0-1.65,4.4A5.831,5.831,0,0,0,34.672.264a8.6,8.6,0,0,0,5.038-1.65L38.874-2.9a7.719,7.719,0,0,1-4.158,1.342,3.9,3.9,0,0,1-4.224-3.5H39.93C39.974-5.588,40-5.94,40-6.094Zm-5.654-4.18A3.473,3.473,0,0,1,37.928-6.82H30.492A3.857,3.857,0,0,1,34.342-10.274ZM43.626,0V-6.556a3.845,3.845,0,0,1,.924-2.662,3.08,3.08,0,0,1,2.4-1.034c1.826,0,3.08,1.32,3.08,3.7V0h1.958V-7.128A4.8,4.8,0,0,0,50.644-10.8a4.617,4.617,0,0,0-3.322-1.276,3.962,3.962,0,0,0-3.74,1.98V-11.77H41.668V0ZM60.94-2.222a4.086,4.086,0,0,1-2.134.7c-1.3,0-1.936-.792-1.936-2.376v-6.182h4.2V-11.77h-4.2v-4.158H54.934v4.158H52.822v1.694h2.09v5.984C54.912-1.3,56.166.286,58.63.286A4.831,4.831,0,0,0,61.71-.7Z" transform="translate(54.108 17.748)" fill="#656565"/>
    </svg>
</div>
<table style="background: #ffffff" width="100%" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="100%">
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td style="width:100%;display:flex;justify-content:center;padding:20px 0px;font-family: Roboto;font-size:20px">
                                <svg xmlns="http://www.w3.org/2000/svg" width="212.987" height="124.358" viewbox="0 0 212.987 124.358" style="padding:20px 0px;">
                                    <g id="Group_1156" data-name="Group 1156" transform="translate(-1097.723 -144.607)">
                                        <path id="Path_6998" data-name="Path 6998" d="M40.115,0A40.115,40.115,0,1,1,0,40.115,40.115,40.115,0,0,1,40.115,0Z" transform="translate(1160.575 171.801)" fill="#2a7ec2"/>
                                        <path id="Path_6997" data-name="Path 6997" d="M28.2,0A28.2,28.2,0,1,1,0,28.2,28.2,28.2,0,0,1,28.2,0Z" transform="translate(1172.491 183.718)" fill="#1c598d"/>
                                        <path id="Path_1741" data-name="Path 1741" d="M1201.641,177.466l-7.968,4.814c-.013-5.41-.527-10.83.495-16.215a26.3,26.3,0,0,1,27.042-21.417c13.6.772,23.911,10.69,25.026,24.063v12.67a25.369,25.369,0,0,1-7.5-4.713c-.013-1.979.051-3.963-.054-5.937-.538-10.136-7.907-17.69-17.819-18.323-8.861-.565-17.141,6.005-19.018,15.2C1201.179,170.858,1201.471,174.173,1201.641,177.466Z" transform="translate(-19.456 0)" fill="#1c598d"/>
                                        <path id="Path_1762" data-name="Path 1762" d="M1226.661,235.809c-.155,2.1-.922,4.13,2.016,5.447,1.245.557.316,3.145.48,4.8-3.564.025-7.135-.056-10.693.109-2.571.119-3.256-.817-2.682-3.273,1.2-5.134,2.145-10.327,3.368-15.455a5.421,5.421,0,0,0-1.144-5.408,8.426,8.426,0,0,1,.661-11.784,8.877,8.877,0,0,1,11.9-.092c3.325,3.078,3.994,8.37.814,11.764-3.048,3.253-.5,6.185-.389,9.26C1227.847,231.13,1225.658,231.975,1226.661,235.809Z" transform="translate(-23.96 -12.925)" fill="#392d2b"/>
                                        <path id="Path_6995" data-name="Path 6995" d="M-14455.474-4887.985c-1.81-.033-.8-2.1-1.074-3.256a1.873,1.873,0,0,1,0-.79c.292-1.446-.754-4.079.886-4.123,2.37-.062,1.085,2.641,1.5,3.85,0,.532.019.8,0,1.06-.108,1.249.3,3.259-1.271,3.26Zm-39.312-17.081c1.665-1.566,2.758-3.857,5.277-4.356.2-.04.769.539.722.667-.9,2.426-3.161,3.675-4.808,5.459-.16.175-.463.218-.714.332C-14495.5-4903.43-14495.582-4904.308-14494.785-4905.065Zm76.332.35a8.088,8.088,0,0,1-1.719-1.584c-1.107-1.387-3.056-2.152-3.292-4.155-.065-.546.725-.816,1.194-.546a17,17,0,0,1,5.361,5.212c-.052.939-.331,1.371-.779,1.371A1.451,1.451,0,0,1-14418.453-4904.716Zm-90.979-35.95c-1.162.083-2.266.171-2.28-1.166-.025-2.018,2.546-1.216,3.923-1.136a8.658,8.658,0,0,0,1.482-.12c1.453-.2,3-.39,3.016,1.391,0,1.191-1.191,1.107-2.444,1.023a5.666,5.666,0,0,0-1.952.083A4.651,4.651,0,0,0-14509.433-4940.666Zm17.762-34.111c-1.649-1.475-3.205-3.059-4.716-4.673-.692-.739-.525-1.424.506-1.653,1.125-.083,5.8,4.469,5.751,5.587-.035.715-.351,1.1-.772,1.1A1.206,1.206,0,0,1-14491.671-4974.776Zm66.685-1.868a1.291,1.291,0,0,1,.3-1.755q2.186-2.246,4.433-4.425a1.251,1.251,0,0,1,1.752-.24c.339.284.706,1.052.557,1.3-1.42,2.386-3.648,4-5.674,6.024A5.612,5.612,0,0,1-14424.986-4976.645Zm-32.789-11.479c-2.007-.033-.845-2.583-1.14-4.006a5.662,5.662,0,0,1,0-1.584c.076-.878-.189-2.16,1.03-2.244,1.617-.113,1.2,1.369,1.322,2.327a16.489,16.489,0,0,1,.011,1.828c-.387,1.129.837,3.679-1.185,3.679Z" transform="translate(15658.448 5156.449)" fill="#c6d7ef" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                                        <path id="Path_6996" data-name="Path 6996" d="M-14430.136-4907.344l-1.621-1.621a1.293,1.293,0,0,1,0-1.835l1.621-1.621a1.292,1.292,0,0,1,1.835,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.288,1.288,0,0,1-.917.382A1.288,1.288,0,0,1-14430.136-4907.344Zm80.989-16.677a2.494,2.494,0,0,1,2.491-2.495,2.494,2.494,0,0,1,2.5,2.495,2.491,2.491,0,0,1-2.5,2.495A2.491,2.491,0,0,1-14349.146-4924.021Zm-127.362,1.807a1.93,1.93,0,0,1-2-2.029,1.834,1.834,0,0,1,2.01-1.963,1.764,1.764,0,0,1,1.974,1.963,1.894,1.894,0,0,1-1.95,2.029Zm152.292-5.026a2.866,2.866,0,0,1,2.862-2.866,2.863,2.863,0,0,1,2.862,2.866,2.86,2.86,0,0,1-2.862,2.862A2.863,2.863,0,0,1-14324.217-4927.24Zm-12.729-8.453-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.293,1.293,0,0,1-.918.379A1.3,1.3,0,0,1-14336.945-4935.693Zm-160.854-.8-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.3,1.3,0,0,1-.921.38A1.294,1.294,0,0,1-14497.8-4936.494Zm185.387-6.5c2.87.8,5.627,1.865,7.651,4.232C-14307.857-4939.12-14310.254-4940.813-14312.413-4943Zm-150.519,1.489a1.875,1.875,0,0,1,1.7-2.072c1.377.08,2.175.67,2.219,1.909a1.823,1.823,0,0,1-1.887,2.04c-.05,0-.1,0-.146,0A1.781,1.781,0,0,1-14462.932-4941.509Zm137.1-11.792c-.754-1.927-1.278-2.539-3.14-.933-1.121.965-2.549.343-3.193-1.11-.168-.372.12-.951.2-1.432,1.242,1.512,2.236.8,3.245.087.721-.51,1.449-1.02,2.279-.707,1.508.564,1.559,1.981,2.262,3.369a19.682,19.682,0,0,1,2.8-1.777,1.677,1.677,0,0,1,2.051.779c.295.5.524,1.431.262,1.8-.8,1.129-1.158-.342-1.773-.492-.994-.244-1.257.772-1.919,1.093a3.547,3.547,0,0,1-1.482.375A1.589,1.589,0,0,1-14325.834-4953.3Zm-154.947.04a1.914,1.914,0,0,1-1.915-2.058,1.847,1.847,0,0,1,2.064-1.861c1.274.007,1.851.769,1.872,2-.146,1.144-.761,1.92-1.87,1.92C-14480.68-4953.257-14480.729-4953.259-14480.781-4953.262Zm175.5-6.687c2.087-.761,3.682.211,5.423.754a11.059,11.059,0,0,1-2.929,4.866C-14303.713-4956.416-14304.456-4958.091-14305.278-4959.948Zm-206.434,3.806a18.375,18.375,0,0,1,8.871-.6l.073,1.162-8.883.48Zm20.777-11.29a2.864,2.864,0,0,1,2.866-2.863,2.863,2.863,0,0,1,2.862,2.863,2.863,2.863,0,0,1-2.862,2.863A2.864,2.864,0,0,1-14490.935-4967.433Zm151.25-.616a2.863,2.863,0,0,1,2.863-2.862,2.86,2.86,0,0,1,2.862,2.862,2.861,2.861,0,0,1-2.862,2.863A2.863,2.863,0,0,1-14339.685-4968.048Zm-132.5-1.482a1.833,1.833,0,0,1,2.032-1.894,1.786,1.786,0,0,1,1.828,2.058,1.868,1.868,0,0,1-2,1.934A1.954,1.954,0,0,1-14472.189-4969.53Zm171.328-6.3a13.333,13.333,0,0,1-8.241,3.445A14.289,14.289,0,0,1-14300.861-4975.834Zm-206.571.674a2.471,2.471,0,0,1-2.43-2.99,2.5,2.5,0,0,1,2.725-2.356,2.812,2.812,0,0,1,2.768,2.681c-.367,1.674-1.219,2.681-2.734,2.681C-14507.21-4975.146-14507.32-4975.151-14507.433-4975.161Zm181.322-2.961c.972-1.876,1.5-4.174,3.233-4.261,1.5-.08,2.28,2.13,3.133,3.81a8.671,8.671,0,0,1-3.455.626C-14324.117-4977.947-14325.073-4978.034-14326.11-4978.122Zm-141.37-9.444a16.744,16.744,0,0,1,.849-2.192c1.533,1.173,3.521,2.455,3.227,3.832-.36,1.693-2.768,1.792-4.814,2.5C-14467.936-4985.071-14467.769-4986.331-14467.48-4987.565Zm-16.338,2.185a1.164,1.164,0,0,0-1.057-.215c-4.374,2.186-4.05-1.129-4.225-3.824-1.9.528-3.955,2.178-4.916-.907a1.677,1.677,0,0,1,.31-1.453c.688-.6,1.132-.149,1.285.638.116.608.488.994,1.078.7,4.429-2.2,3.98,1.133,4.2,3.722a2.383,2.383,0,0,0,1.6-.372,2.24,2.24,0,0,1,1.767-.324c.987.321,1.66.863,1.7,1.9.019.466-.164,1.224-.477,1.369a1.385,1.385,0,0,1-.554.155C-14483.754-4983.987-14483.479-4985.011-14483.818-4985.38Zm133.711-.462-1.621-1.621a1.3,1.3,0,0,1,0-1.839l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.839l-1.621,1.621a1.294,1.294,0,0,1-.918.38A1.3,1.3,0,0,1-14350.107-4985.843Zm24.277-10.121a12.917,12.917,0,0,1-4.662,7.579A16.015,16.015,0,0,1-14325.83-4995.964Z" transform="translate(15609.956 5173.674)" fill="#ff505c" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                                        <path id="Path_1764" data-name="Path 1764" d="M1237.462,247.13s.391,9.109-5.8,6.531c0,0,2.1-3.752-1.461-5.465,0,0-2.581-2.489-.526-4.79h27.771s5.787-.127,5.3,4.753h-14.97s-3.817-.637-4.028,2.322-.707,3.063-2.594,3.348-2.679-1.167-2.333-3.718S1237.462,247.13,1237.462,247.13Z" transform="translate(-26.672 -20.172)" fill="#b98c1d"/>
                                        <path id="Path_1765" data-name="Path 1765" d="M1289.136,239.483c-1.7-17.863-21.507-13.843-23.607-8.234s-7.736,4.137-7.736,4.137-20.914-.048-25.336,0-3.011,4.583-3.011,4.583l27.667-.041c6.2-.153,5.837,5.112,5.837,5.112C1265.528,256.706,1290.836,257.346,1289.136,239.483Zm-13.487,6.358a5.634,5.634,0,1,1,5.634-5.634A5.635,5.635,0,0,1,1275.65,245.841Z" transform="translate(-26.745 -16.719)" fill="#ffc626"/>
                                    </g>
                                </svg>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 25px; font-size: 18px; color: #000000; font-family: Roboto;text-align:center;font-weight:600;">
                                Assalamoalikum dear ${user.firstname},
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 25px 0;">
                                <table style="width: 100%;">
                                    <tbody>
                                        <tr>
                                            <td style="font-size: 13px; font-family: Roboto; color: #000000;text-align:center;">

                                            آپ کی ممبر شپ درخواست قبول کر دی گئی ہے براہِ مہربانی ویبسائٹ پر لاگ-ان کر کے سہولیات سے فائدہ آٹھائیں۔
نوٹ: سائن-اپ کرتے وقت جو موبائل نمبر اور پاسورڈ استعمال کیا گیا تھا وہی موبائل نمبر اور پاسورڈ استعمال کریں۔ شکریہ۔
                                            <br/><br/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;padding:20px 0px;font-family: Roboto;font-size:16px;">
                                                <span style="font-size:14px">From,</span>
                                                <br/>
                                                Kamboh welfare anjuman Karachi.
                                                <br/>
                                                <br/>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
</div>
</body>

          `
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email successfuly send to member")

                        

                    }
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
        transactionid: req.body.transactionid,
        purpose: req.body.purpose,
        userId: req.body.userId,
        date: req.body.date,
        donationStatus:req.body.donationStatus

    });

    newMydonation.save().then((newres) => {
        res.send({ success: true, newres })
        var mailOptions = {
            from: 'kambohwelfareanjumankarachi@gmail.com',
            to: 'kambohwelfareanjumankarachi@gmail.com',
            subject: 'Fund receiving email',
            html: `
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
<style>
body,
html {
    padding: 0;
    margin: 0;
}

sup {
    font-size: 6px;
}

@media screen and (max-width:600px) {
    table {
        width: 100% !important;
    }
    .parentDiv {
        width: 100% !important;
        padding: 0 !important;
    }
    .bottomContent{
        padding:0px 10px;
    }
}
</style>
</head>
<body style="display:flex;justify-content:center;">
<div class="parentDiv" style="width:100%;background:#F3F7FA;display:flex;flex-direction:column;align-items:center;padding:0px 20px;">
<div style="padding:15px 0px;font-size:40px;color:#E70030;font-family:Roboto;font-weight:bold">
<svg id="Group_1778" data-name="Group 1778" xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewbox="0 0 115.818 22.742">
<g id="Group_2" data-name="Group 2">
    <path id="Path_4" data-name="Path 4" d="M1100.989,1001.741a2.246,2.246,0,1,1,2.259,2.234A2.206,2.206,0,0,1,1100.989,1001.741Zm.337,16.742V1005.32h3.771v13.162Z" transform="translate(-1100.989 -999.507)" fill="#e70030"/>
    <path id="Path_5" data-name="Path 5" d="M1121.381,1011.932a6.58,6.58,0,0,1-6.557,6.917,4.967,4.967,0,0,1-3.939-1.8v1.465h-3.65v-18.279H1111v6.414a5.065,5.065,0,0,1,3.819-1.633A6.594,6.594,0,0,1,1121.381,1011.932Zm-3.843-.024a3.3,3.3,0,0,0-3.339-3.435,3.461,3.461,0,1,0,3.339,3.435Z" transform="translate(-1101.252 -999.538)" fill="#e70030"/>
    <path id="Path_6" data-name="Path 6" d="M1136.157,1013.415h-9.681a3.363,3.363,0,0,0,3.579,2.474,7.9,7.9,0,0,0,4.107-1.273l1.49,2.57a9.731,9.731,0,0,1-5.765,1.826c-4.923,0-7.206-3.315-7.206-6.893a6.647,6.647,0,0,1,6.942-6.894,6.263,6.263,0,0,1,6.653,6.605A11.78,11.78,0,0,1,1136.157,1013.415Zm-9.7-2.69h6.2a2.965,2.965,0,0,0-3.026-2.45C1128.086,1008.275,1126.452,1010.725,1126.452,1010.725Z" transform="translate(-1101.904 -999.748)" fill="#e70030"/>
    <path id="Path_7" data-name="Path 7" d="M1145.33,1018.738l-2.282-4.107-2.426,4.107h-4.3l4.252-6.677-3.771-6.485h4.3l2.017,3.843,2.21-3.843h4.228l-4.011,6.557,4.131,6.605Z" transform="translate(-1102.479 -999.763)" fill="#e70030"/>
    <path id="Path_8" data-name="Path 8" d="M1150.467,1017.421a2.1,2.1,0,0,1,4.2,0,2.1,2.1,0,1,1-4.2,0Z" transform="translate(-1103.075 -1000.174)" fill="#e70030"/>
</g>
<path id="Path_1768" data-name="Path 1768" d="M11.022-10.032a5.159,5.159,0,0,0-4.2-2.024A5.608,5.608,0,0,0,2.6-10.318,5.956,5.956,0,0,0,.924-5.962,6.29,6.29,0,0,0,2.6-1.5,5.566,5.566,0,0,0,6.82.286a5.151,5.151,0,0,0,4.2-1.98V0h1.892V-11.77H11.022ZM11.176-5.9A4.508,4.508,0,0,1,10.01-2.772,3.871,3.871,0,0,1,7.018-1.518,3.871,3.871,0,0,1,4.026-2.772,4.56,4.56,0,0,1,2.9-5.874a4.482,4.482,0,0,1,1.122-3.1,3.815,3.815,0,0,1,2.992-1.276A3.815,3.815,0,0,1,10.01-8.976,4.4,4.4,0,0,1,11.176-5.9ZM24.728-10.23a5.128,5.128,0,0,0-4.092-1.826,5.774,5.774,0,0,0-4.268,1.738,5.823,5.823,0,0,0-1.738,4.29,5.977,5.977,0,0,0,1.694,4.312A5.608,5.608,0,0,0,20.548.022a5.225,5.225,0,0,0,4.18-1.848v.968A3.83,3.83,0,0,1,23.54,2.068a4.238,4.238,0,0,1-3.124,1.144,6.927,6.927,0,0,1-4.2-1.43l-.946,1.562a8.556,8.556,0,0,0,5.148,1.65A6.147,6.147,0,0,0,24.97,3.322,6.036,6.036,0,0,0,26.686-1.21V-11.77H24.728Zm-3.982-.044a3.882,3.882,0,0,1,2.948,1.21,4.182,4.182,0,0,1,1.188,3.036A4.233,4.233,0,0,1,23.694-2.97a3.882,3.882,0,0,1-2.948,1.21,3.964,3.964,0,0,1-2.97-1.21A4.272,4.272,0,0,1,16.61-6.028a4.255,4.255,0,0,1,1.166-3.036A3.9,3.9,0,0,1,20.746-10.274ZM40-6.094a5.956,5.956,0,0,0-1.584-4.356,5.453,5.453,0,0,0-4.07-1.606,5.605,5.605,0,0,0-4.268,1.738,6.135,6.135,0,0,0-1.65,4.4A5.831,5.831,0,0,0,34.672.264a8.6,8.6,0,0,0,5.038-1.65L38.874-2.9a7.719,7.719,0,0,1-4.158,1.342,3.9,3.9,0,0,1-4.224-3.5H39.93C39.974-5.588,40-5.94,40-6.094Zm-5.654-4.18A3.473,3.473,0,0,1,37.928-6.82H30.492A3.857,3.857,0,0,1,34.342-10.274ZM43.626,0V-6.556a3.845,3.845,0,0,1,.924-2.662,3.08,3.08,0,0,1,2.4-1.034c1.826,0,3.08,1.32,3.08,3.7V0h1.958V-7.128A4.8,4.8,0,0,0,50.644-10.8a4.617,4.617,0,0,0-3.322-1.276,3.962,3.962,0,0,0-3.74,1.98V-11.77H41.668V0ZM60.94-2.222a4.086,4.086,0,0,1-2.134.7c-1.3,0-1.936-.792-1.936-2.376v-6.182h4.2V-11.77h-4.2v-4.158H54.934v4.158H52.822v1.694h2.09v5.984C54.912-1.3,56.166.286,58.63.286A4.831,4.831,0,0,0,61.71-.7Z" transform="translate(54.108 17.748)" fill="#656565"/>
</svg>
</div>
<table style="background: #ffffff" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
    <td width="100%">
        <table width="100%" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td style="width:100%;display:flex;justify-content:center;padding:20px 0px;font-family: Roboto;font-size:20px">
                        <svg xmlns="http://www.w3.org/2000/svg" width="212.987" height="124.358" viewbox="0 0 212.987 124.358" style="padding:20px 0px;">
                            <g id="Group_1156" data-name="Group 1156" transform="translate(-1097.723 -144.607)">
                                <path id="Path_6998" data-name="Path 6998" d="M40.115,0A40.115,40.115,0,1,1,0,40.115,40.115,40.115,0,0,1,40.115,0Z" transform="translate(1160.575 171.801)" fill="#2a7ec2"/>
                                <path id="Path_6997" data-name="Path 6997" d="M28.2,0A28.2,28.2,0,1,1,0,28.2,28.2,28.2,0,0,1,28.2,0Z" transform="translate(1172.491 183.718)" fill="#1c598d"/>
                                <path id="Path_1741" data-name="Path 1741" d="M1201.641,177.466l-7.968,4.814c-.013-5.41-.527-10.83.495-16.215a26.3,26.3,0,0,1,27.042-21.417c13.6.772,23.911,10.69,25.026,24.063v12.67a25.369,25.369,0,0,1-7.5-4.713c-.013-1.979.051-3.963-.054-5.937-.538-10.136-7.907-17.69-17.819-18.323-8.861-.565-17.141,6.005-19.018,15.2C1201.179,170.858,1201.471,174.173,1201.641,177.466Z" transform="translate(-19.456 0)" fill="#1c598d"/>
                                <path id="Path_1762" data-name="Path 1762" d="M1226.661,235.809c-.155,2.1-.922,4.13,2.016,5.447,1.245.557.316,3.145.48,4.8-3.564.025-7.135-.056-10.693.109-2.571.119-3.256-.817-2.682-3.273,1.2-5.134,2.145-10.327,3.368-15.455a5.421,5.421,0,0,0-1.144-5.408,8.426,8.426,0,0,1,.661-11.784,8.877,8.877,0,0,1,11.9-.092c3.325,3.078,3.994,8.37.814,11.764-3.048,3.253-.5,6.185-.389,9.26C1227.847,231.13,1225.658,231.975,1226.661,235.809Z" transform="translate(-23.96 -12.925)" fill="#392d2b"/>
                                <path id="Path_6995" data-name="Path 6995" d="M-14455.474-4887.985c-1.81-.033-.8-2.1-1.074-3.256a1.873,1.873,0,0,1,0-.79c.292-1.446-.754-4.079.886-4.123,2.37-.062,1.085,2.641,1.5,3.85,0,.532.019.8,0,1.06-.108,1.249.3,3.259-1.271,3.26Zm-39.312-17.081c1.665-1.566,2.758-3.857,5.277-4.356.2-.04.769.539.722.667-.9,2.426-3.161,3.675-4.808,5.459-.16.175-.463.218-.714.332C-14495.5-4903.43-14495.582-4904.308-14494.785-4905.065Zm76.332.35a8.088,8.088,0,0,1-1.719-1.584c-1.107-1.387-3.056-2.152-3.292-4.155-.065-.546.725-.816,1.194-.546a17,17,0,0,1,5.361,5.212c-.052.939-.331,1.371-.779,1.371A1.451,1.451,0,0,1-14418.453-4904.716Zm-90.979-35.95c-1.162.083-2.266.171-2.28-1.166-.025-2.018,2.546-1.216,3.923-1.136a8.658,8.658,0,0,0,1.482-.12c1.453-.2,3-.39,3.016,1.391,0,1.191-1.191,1.107-2.444,1.023a5.666,5.666,0,0,0-1.952.083A4.651,4.651,0,0,0-14509.433-4940.666Zm17.762-34.111c-1.649-1.475-3.205-3.059-4.716-4.673-.692-.739-.525-1.424.506-1.653,1.125-.083,5.8,4.469,5.751,5.587-.035.715-.351,1.1-.772,1.1A1.206,1.206,0,0,1-14491.671-4974.776Zm66.685-1.868a1.291,1.291,0,0,1,.3-1.755q2.186-2.246,4.433-4.425a1.251,1.251,0,0,1,1.752-.24c.339.284.706,1.052.557,1.3-1.42,2.386-3.648,4-5.674,6.024A5.612,5.612,0,0,1-14424.986-4976.645Zm-32.789-11.479c-2.007-.033-.845-2.583-1.14-4.006a5.662,5.662,0,0,1,0-1.584c.076-.878-.189-2.16,1.03-2.244,1.617-.113,1.2,1.369,1.322,2.327a16.489,16.489,0,0,1,.011,1.828c-.387,1.129.837,3.679-1.185,3.679Z" transform="translate(15658.448 5156.449)" fill="#c6d7ef" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                                <path id="Path_6996" data-name="Path 6996" d="M-14430.136-4907.344l-1.621-1.621a1.293,1.293,0,0,1,0-1.835l1.621-1.621a1.292,1.292,0,0,1,1.835,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.288,1.288,0,0,1-.917.382A1.288,1.288,0,0,1-14430.136-4907.344Zm80.989-16.677a2.494,2.494,0,0,1,2.491-2.495,2.494,2.494,0,0,1,2.5,2.495,2.491,2.491,0,0,1-2.5,2.495A2.491,2.491,0,0,1-14349.146-4924.021Zm-127.362,1.807a1.93,1.93,0,0,1-2-2.029,1.834,1.834,0,0,1,2.01-1.963,1.764,1.764,0,0,1,1.974,1.963,1.894,1.894,0,0,1-1.95,2.029Zm152.292-5.026a2.866,2.866,0,0,1,2.862-2.866,2.863,2.863,0,0,1,2.862,2.866,2.86,2.86,0,0,1-2.862,2.862A2.863,2.863,0,0,1-14324.217-4927.24Zm-12.729-8.453-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.293,1.293,0,0,1-.918.379A1.3,1.3,0,0,1-14336.945-4935.693Zm-160.854-.8-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.3,1.3,0,0,1-.921.38A1.294,1.294,0,0,1-14497.8-4936.494Zm185.387-6.5c2.87.8,5.627,1.865,7.651,4.232C-14307.857-4939.12-14310.254-4940.813-14312.413-4943Zm-150.519,1.489a1.875,1.875,0,0,1,1.7-2.072c1.377.08,2.175.67,2.219,1.909a1.823,1.823,0,0,1-1.887,2.04c-.05,0-.1,0-.146,0A1.781,1.781,0,0,1-14462.932-4941.509Zm137.1-11.792c-.754-1.927-1.278-2.539-3.14-.933-1.121.965-2.549.343-3.193-1.11-.168-.372.12-.951.2-1.432,1.242,1.512,2.236.8,3.245.087.721-.51,1.449-1.02,2.279-.707,1.508.564,1.559,1.981,2.262,3.369a19.682,19.682,0,0,1,2.8-1.777,1.677,1.677,0,0,1,2.051.779c.295.5.524,1.431.262,1.8-.8,1.129-1.158-.342-1.773-.492-.994-.244-1.257.772-1.919,1.093a3.547,3.547,0,0,1-1.482.375A1.589,1.589,0,0,1-14325.834-4953.3Zm-154.947.04a1.914,1.914,0,0,1-1.915-2.058,1.847,1.847,0,0,1,2.064-1.861c1.274.007,1.851.769,1.872,2-.146,1.144-.761,1.92-1.87,1.92C-14480.68-4953.257-14480.729-4953.259-14480.781-4953.262Zm175.5-6.687c2.087-.761,3.682.211,5.423.754a11.059,11.059,0,0,1-2.929,4.866C-14303.713-4956.416-14304.456-4958.091-14305.278-4959.948Zm-206.434,3.806a18.375,18.375,0,0,1,8.871-.6l.073,1.162-8.883.48Zm20.777-11.29a2.864,2.864,0,0,1,2.866-2.863,2.863,2.863,0,0,1,2.862,2.863,2.863,2.863,0,0,1-2.862,2.863A2.864,2.864,0,0,1-14490.935-4967.433Zm151.25-.616a2.863,2.863,0,0,1,2.863-2.862,2.86,2.86,0,0,1,2.862,2.862,2.861,2.861,0,0,1-2.862,2.863A2.863,2.863,0,0,1-14339.685-4968.048Zm-132.5-1.482a1.833,1.833,0,0,1,2.032-1.894,1.786,1.786,0,0,1,1.828,2.058,1.868,1.868,0,0,1-2,1.934A1.954,1.954,0,0,1-14472.189-4969.53Zm171.328-6.3a13.333,13.333,0,0,1-8.241,3.445A14.289,14.289,0,0,1-14300.861-4975.834Zm-206.571.674a2.471,2.471,0,0,1-2.43-2.99,2.5,2.5,0,0,1,2.725-2.356,2.812,2.812,0,0,1,2.768,2.681c-.367,1.674-1.219,2.681-2.734,2.681C-14507.21-4975.146-14507.32-4975.151-14507.433-4975.161Zm181.322-2.961c.972-1.876,1.5-4.174,3.233-4.261,1.5-.08,2.28,2.13,3.133,3.81a8.671,8.671,0,0,1-3.455.626C-14324.117-4977.947-14325.073-4978.034-14326.11-4978.122Zm-141.37-9.444a16.744,16.744,0,0,1,.849-2.192c1.533,1.173,3.521,2.455,3.227,3.832-.36,1.693-2.768,1.792-4.814,2.5C-14467.936-4985.071-14467.769-4986.331-14467.48-4987.565Zm-16.338,2.185a1.164,1.164,0,0,0-1.057-.215c-4.374,2.186-4.05-1.129-4.225-3.824-1.9.528-3.955,2.178-4.916-.907a1.677,1.677,0,0,1,.31-1.453c.688-.6,1.132-.149,1.285.638.116.608.488.994,1.078.7,4.429-2.2,3.98,1.133,4.2,3.722a2.383,2.383,0,0,0,1.6-.372,2.24,2.24,0,0,1,1.767-.324c.987.321,1.66.863,1.7,1.9.019.466-.164,1.224-.477,1.369a1.385,1.385,0,0,1-.554.155C-14483.754-4983.987-14483.479-4985.011-14483.818-4985.38Zm133.711-.462-1.621-1.621a1.3,1.3,0,0,1,0-1.839l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.839l-1.621,1.621a1.294,1.294,0,0,1-.918.38A1.3,1.3,0,0,1-14350.107-4985.843Zm24.277-10.121a12.917,12.917,0,0,1-4.662,7.579A16.015,16.015,0,0,1-14325.83-4995.964Z" transform="translate(15609.956 5173.674)" fill="#ff505c" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                                <path id="Path_1764" data-name="Path 1764" d="M1237.462,247.13s.391,9.109-5.8,6.531c0,0,2.1-3.752-1.461-5.465,0,0-2.581-2.489-.526-4.79h27.771s5.787-.127,5.3,4.753h-14.97s-3.817-.637-4.028,2.322-.707,3.063-2.594,3.348-2.679-1.167-2.333-3.718S1237.462,247.13,1237.462,247.13Z" transform="translate(-26.672 -20.172)" fill="#b98c1d"/>
                                <path id="Path_1765" data-name="Path 1765" d="M1289.136,239.483c-1.7-17.863-21.507-13.843-23.607-8.234s-7.736,4.137-7.736,4.137-20.914-.048-25.336,0-3.011,4.583-3.011,4.583l27.667-.041c6.2-.153,5.837,5.112,5.837,5.112C1265.528,256.706,1290.836,257.346,1289.136,239.483Zm-13.487,6.358a5.634,5.634,0,1,1,5.634-5.634A5.635,5.635,0,0,1,1275.65,245.841Z" transform="translate(-26.745 -16.719)" fill="#ffc626"/>
                            </g>
                        </svg>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 25px; font-size: 18px; color: #000000; font-family: Roboto;text-align:center;font-weight:600;">
                    آداب ایڈمن
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 25px 0;">
                        <table style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td style="font-size: 13px; font-family: Roboto; color: #000000;text-align:center;">

                                 Dear Admin ap ko  ${req.body.members.firstname} ${req.body.members.fathername}  ny ${req.body.amount} fund transfer kiya ha mehrabnai farma kr admin panel mai ja k fund verify kren ta k member ki profile manage ho sake or admin k pass bhi us kay fund ka hissab ho.thanks      
             
                 
                                    
                                  
                                     
                                    <br/><br/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;padding:20px 0px;font-family: Roboto;font-size:16px;">
                                        <span style="font-size:14px">From,</span>
                                        <br/>
                                        Kamboh welfare anjuman Karachi.
                                        <br/>
                                        <br/>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </td>
</tr>
</tbody>
</table>
</div>
</body>

  `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email successfuly send to member")
            }
        });

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



router.post('/updatememberdonation', (req, res) => {
    Mydonation.findOne({ _id: req.body.userID }).then(member => {
        var user = member;
        user['donationStatus'] = 'approved';
        Mydonation.updateOne({ _id: req.body.userID }, { $set: user }).then(updated => {
            if (updated) {
                res.send({ success: true, })

           

                var mailOptions = {
                    from: 'kambohwelfareanjumankarachi@gmail.com',
                    to: user.email,
                    subject: 'thanks for donation',
                    html: `
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
    <style>
        body,
        html {
            padding: 0;
            margin: 0;
        }

        sup {
            font-size: 6px;
        }

        @media screen and (max-width:600px) {
            table {
                width: 100% !important;
            }
            .parentDiv {
                width: 100% !important;
                padding: 0 !important;
            }
            .bottomContent{
                padding:0px 10px;
            }
        }
    </style>
</head>
    <body style="display:flex;justify-content:center;">
<div class="parentDiv" style="width:100%;background:#F3F7FA;display:flex;flex-direction:column;align-items:center;padding:0px 20px;">
<div style="padding:15px 0px;font-size:40px;color:#E70030;font-family:Roboto;font-weight:bold">
    <svg id="Group_1778" data-name="Group 1778" xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewbox="0 0 115.818 22.742">
        <g id="Group_2" data-name="Group 2">
            <path id="Path_4" data-name="Path 4" d="M1100.989,1001.741a2.246,2.246,0,1,1,2.259,2.234A2.206,2.206,0,0,1,1100.989,1001.741Zm.337,16.742V1005.32h3.771v13.162Z" transform="translate(-1100.989 -999.507)" fill="#e70030"/>
            <path id="Path_5" data-name="Path 5" d="M1121.381,1011.932a6.58,6.58,0,0,1-6.557,6.917,4.967,4.967,0,0,1-3.939-1.8v1.465h-3.65v-18.279H1111v6.414a5.065,5.065,0,0,1,3.819-1.633A6.594,6.594,0,0,1,1121.381,1011.932Zm-3.843-.024a3.3,3.3,0,0,0-3.339-3.435,3.461,3.461,0,1,0,3.339,3.435Z" transform="translate(-1101.252 -999.538)" fill="#e70030"/>
            <path id="Path_6" data-name="Path 6" d="M1136.157,1013.415h-9.681a3.363,3.363,0,0,0,3.579,2.474,7.9,7.9,0,0,0,4.107-1.273l1.49,2.57a9.731,9.731,0,0,1-5.765,1.826c-4.923,0-7.206-3.315-7.206-6.893a6.647,6.647,0,0,1,6.942-6.894,6.263,6.263,0,0,1,6.653,6.605A11.78,11.78,0,0,1,1136.157,1013.415Zm-9.7-2.69h6.2a2.965,2.965,0,0,0-3.026-2.45C1128.086,1008.275,1126.452,1010.725,1126.452,1010.725Z" transform="translate(-1101.904 -999.748)" fill="#e70030"/>
            <path id="Path_7" data-name="Path 7" d="M1145.33,1018.738l-2.282-4.107-2.426,4.107h-4.3l4.252-6.677-3.771-6.485h4.3l2.017,3.843,2.21-3.843h4.228l-4.011,6.557,4.131,6.605Z" transform="translate(-1102.479 -999.763)" fill="#e70030"/>
            <path id="Path_8" data-name="Path 8" d="M1150.467,1017.421a2.1,2.1,0,0,1,4.2,0,2.1,2.1,0,1,1-4.2,0Z" transform="translate(-1103.075 -1000.174)" fill="#e70030"/>
        </g>
        <path id="Path_1768" data-name="Path 1768" d="M11.022-10.032a5.159,5.159,0,0,0-4.2-2.024A5.608,5.608,0,0,0,2.6-10.318,5.956,5.956,0,0,0,.924-5.962,6.29,6.29,0,0,0,2.6-1.5,5.566,5.566,0,0,0,6.82.286a5.151,5.151,0,0,0,4.2-1.98V0h1.892V-11.77H11.022ZM11.176-5.9A4.508,4.508,0,0,1,10.01-2.772,3.871,3.871,0,0,1,7.018-1.518,3.871,3.871,0,0,1,4.026-2.772,4.56,4.56,0,0,1,2.9-5.874a4.482,4.482,0,0,1,1.122-3.1,3.815,3.815,0,0,1,2.992-1.276A3.815,3.815,0,0,1,10.01-8.976,4.4,4.4,0,0,1,11.176-5.9ZM24.728-10.23a5.128,5.128,0,0,0-4.092-1.826,5.774,5.774,0,0,0-4.268,1.738,5.823,5.823,0,0,0-1.738,4.29,5.977,5.977,0,0,0,1.694,4.312A5.608,5.608,0,0,0,20.548.022a5.225,5.225,0,0,0,4.18-1.848v.968A3.83,3.83,0,0,1,23.54,2.068a4.238,4.238,0,0,1-3.124,1.144,6.927,6.927,0,0,1-4.2-1.43l-.946,1.562a8.556,8.556,0,0,0,5.148,1.65A6.147,6.147,0,0,0,24.97,3.322,6.036,6.036,0,0,0,26.686-1.21V-11.77H24.728Zm-3.982-.044a3.882,3.882,0,0,1,2.948,1.21,4.182,4.182,0,0,1,1.188,3.036A4.233,4.233,0,0,1,23.694-2.97a3.882,3.882,0,0,1-2.948,1.21,3.964,3.964,0,0,1-2.97-1.21A4.272,4.272,0,0,1,16.61-6.028a4.255,4.255,0,0,1,1.166-3.036A3.9,3.9,0,0,1,20.746-10.274ZM40-6.094a5.956,5.956,0,0,0-1.584-4.356,5.453,5.453,0,0,0-4.07-1.606,5.605,5.605,0,0,0-4.268,1.738,6.135,6.135,0,0,0-1.65,4.4A5.831,5.831,0,0,0,34.672.264a8.6,8.6,0,0,0,5.038-1.65L38.874-2.9a7.719,7.719,0,0,1-4.158,1.342,3.9,3.9,0,0,1-4.224-3.5H39.93C39.974-5.588,40-5.94,40-6.094Zm-5.654-4.18A3.473,3.473,0,0,1,37.928-6.82H30.492A3.857,3.857,0,0,1,34.342-10.274ZM43.626,0V-6.556a3.845,3.845,0,0,1,.924-2.662,3.08,3.08,0,0,1,2.4-1.034c1.826,0,3.08,1.32,3.08,3.7V0h1.958V-7.128A4.8,4.8,0,0,0,50.644-10.8a4.617,4.617,0,0,0-3.322-1.276,3.962,3.962,0,0,0-3.74,1.98V-11.77H41.668V0ZM60.94-2.222a4.086,4.086,0,0,1-2.134.7c-1.3,0-1.936-.792-1.936-2.376v-6.182h4.2V-11.77h-4.2v-4.158H54.934v4.158H52.822v1.694h2.09v5.984C54.912-1.3,56.166.286,58.63.286A4.831,4.831,0,0,0,61.71-.7Z" transform="translate(54.108 17.748)" fill="#656565"/>
    </svg>
</div>
<table style="background: #ffffff" width="100%" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td width="100%">
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td style="width:100%;display:flex;justify-content:center;padding:20px 0px;font-family: Roboto;font-size:20px">
                                <svg xmlns="http://www.w3.org/2000/svg" width="212.987" height="124.358" viewbox="0 0 212.987 124.358" style="padding:20px 0px;">
                                    <g id="Group_1156" data-name="Group 1156" transform="translate(-1097.723 -144.607)">
                                        <path id="Path_6998" data-name="Path 6998" d="M40.115,0A40.115,40.115,0,1,1,0,40.115,40.115,40.115,0,0,1,40.115,0Z" transform="translate(1160.575 171.801)" fill="#2a7ec2"/>
                                        <path id="Path_6997" data-name="Path 6997" d="M28.2,0A28.2,28.2,0,1,1,0,28.2,28.2,28.2,0,0,1,28.2,0Z" transform="translate(1172.491 183.718)" fill="#1c598d"/>
                                        <path id="Path_1741" data-name="Path 1741" d="M1201.641,177.466l-7.968,4.814c-.013-5.41-.527-10.83.495-16.215a26.3,26.3,0,0,1,27.042-21.417c13.6.772,23.911,10.69,25.026,24.063v12.67a25.369,25.369,0,0,1-7.5-4.713c-.013-1.979.051-3.963-.054-5.937-.538-10.136-7.907-17.69-17.819-18.323-8.861-.565-17.141,6.005-19.018,15.2C1201.179,170.858,1201.471,174.173,1201.641,177.466Z" transform="translate(-19.456 0)" fill="#1c598d"/>
                                        <path id="Path_1762" data-name="Path 1762" d="M1226.661,235.809c-.155,2.1-.922,4.13,2.016,5.447,1.245.557.316,3.145.48,4.8-3.564.025-7.135-.056-10.693.109-2.571.119-3.256-.817-2.682-3.273,1.2-5.134,2.145-10.327,3.368-15.455a5.421,5.421,0,0,0-1.144-5.408,8.426,8.426,0,0,1,.661-11.784,8.877,8.877,0,0,1,11.9-.092c3.325,3.078,3.994,8.37.814,11.764-3.048,3.253-.5,6.185-.389,9.26C1227.847,231.13,1225.658,231.975,1226.661,235.809Z" transform="translate(-23.96 -12.925)" fill="#392d2b"/>
                                        <path id="Path_6995" data-name="Path 6995" d="M-14455.474-4887.985c-1.81-.033-.8-2.1-1.074-3.256a1.873,1.873,0,0,1,0-.79c.292-1.446-.754-4.079.886-4.123,2.37-.062,1.085,2.641,1.5,3.85,0,.532.019.8,0,1.06-.108,1.249.3,3.259-1.271,3.26Zm-39.312-17.081c1.665-1.566,2.758-3.857,5.277-4.356.2-.04.769.539.722.667-.9,2.426-3.161,3.675-4.808,5.459-.16.175-.463.218-.714.332C-14495.5-4903.43-14495.582-4904.308-14494.785-4905.065Zm76.332.35a8.088,8.088,0,0,1-1.719-1.584c-1.107-1.387-3.056-2.152-3.292-4.155-.065-.546.725-.816,1.194-.546a17,17,0,0,1,5.361,5.212c-.052.939-.331,1.371-.779,1.371A1.451,1.451,0,0,1-14418.453-4904.716Zm-90.979-35.95c-1.162.083-2.266.171-2.28-1.166-.025-2.018,2.546-1.216,3.923-1.136a8.658,8.658,0,0,0,1.482-.12c1.453-.2,3-.39,3.016,1.391,0,1.191-1.191,1.107-2.444,1.023a5.666,5.666,0,0,0-1.952.083A4.651,4.651,0,0,0-14509.433-4940.666Zm17.762-34.111c-1.649-1.475-3.205-3.059-4.716-4.673-.692-.739-.525-1.424.506-1.653,1.125-.083,5.8,4.469,5.751,5.587-.035.715-.351,1.1-.772,1.1A1.206,1.206,0,0,1-14491.671-4974.776Zm66.685-1.868a1.291,1.291,0,0,1,.3-1.755q2.186-2.246,4.433-4.425a1.251,1.251,0,0,1,1.752-.24c.339.284.706,1.052.557,1.3-1.42,2.386-3.648,4-5.674,6.024A5.612,5.612,0,0,1-14424.986-4976.645Zm-32.789-11.479c-2.007-.033-.845-2.583-1.14-4.006a5.662,5.662,0,0,1,0-1.584c.076-.878-.189-2.16,1.03-2.244,1.617-.113,1.2,1.369,1.322,2.327a16.489,16.489,0,0,1,.011,1.828c-.387,1.129.837,3.679-1.185,3.679Z" transform="translate(15658.448 5156.449)" fill="#c6d7ef" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                                        <path id="Path_6996" data-name="Path 6996" d="M-14430.136-4907.344l-1.621-1.621a1.293,1.293,0,0,1,0-1.835l1.621-1.621a1.292,1.292,0,0,1,1.835,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.288,1.288,0,0,1-.917.382A1.288,1.288,0,0,1-14430.136-4907.344Zm80.989-16.677a2.494,2.494,0,0,1,2.491-2.495,2.494,2.494,0,0,1,2.5,2.495,2.491,2.491,0,0,1-2.5,2.495A2.491,2.491,0,0,1-14349.146-4924.021Zm-127.362,1.807a1.93,1.93,0,0,1-2-2.029,1.834,1.834,0,0,1,2.01-1.963,1.764,1.764,0,0,1,1.974,1.963,1.894,1.894,0,0,1-1.95,2.029Zm152.292-5.026a2.866,2.866,0,0,1,2.862-2.866,2.863,2.863,0,0,1,2.862,2.866,2.86,2.86,0,0,1-2.862,2.862A2.863,2.863,0,0,1-14324.217-4927.24Zm-12.729-8.453-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.293,1.293,0,0,1-.918.379A1.3,1.3,0,0,1-14336.945-4935.693Zm-160.854-.8-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.3,1.3,0,0,1-.921.38A1.294,1.294,0,0,1-14497.8-4936.494Zm185.387-6.5c2.87.8,5.627,1.865,7.651,4.232C-14307.857-4939.12-14310.254-4940.813-14312.413-4943Zm-150.519,1.489a1.875,1.875,0,0,1,1.7-2.072c1.377.08,2.175.67,2.219,1.909a1.823,1.823,0,0,1-1.887,2.04c-.05,0-.1,0-.146,0A1.781,1.781,0,0,1-14462.932-4941.509Zm137.1-11.792c-.754-1.927-1.278-2.539-3.14-.933-1.121.965-2.549.343-3.193-1.11-.168-.372.12-.951.2-1.432,1.242,1.512,2.236.8,3.245.087.721-.51,1.449-1.02,2.279-.707,1.508.564,1.559,1.981,2.262,3.369a19.682,19.682,0,0,1,2.8-1.777,1.677,1.677,0,0,1,2.051.779c.295.5.524,1.431.262,1.8-.8,1.129-1.158-.342-1.773-.492-.994-.244-1.257.772-1.919,1.093a3.547,3.547,0,0,1-1.482.375A1.589,1.589,0,0,1-14325.834-4953.3Zm-154.947.04a1.914,1.914,0,0,1-1.915-2.058,1.847,1.847,0,0,1,2.064-1.861c1.274.007,1.851.769,1.872,2-.146,1.144-.761,1.92-1.87,1.92C-14480.68-4953.257-14480.729-4953.259-14480.781-4953.262Zm175.5-6.687c2.087-.761,3.682.211,5.423.754a11.059,11.059,0,0,1-2.929,4.866C-14303.713-4956.416-14304.456-4958.091-14305.278-4959.948Zm-206.434,3.806a18.375,18.375,0,0,1,8.871-.6l.073,1.162-8.883.48Zm20.777-11.29a2.864,2.864,0,0,1,2.866-2.863,2.863,2.863,0,0,1,2.862,2.863,2.863,2.863,0,0,1-2.862,2.863A2.864,2.864,0,0,1-14490.935-4967.433Zm151.25-.616a2.863,2.863,0,0,1,2.863-2.862,2.86,2.86,0,0,1,2.862,2.862,2.861,2.861,0,0,1-2.862,2.863A2.863,2.863,0,0,1-14339.685-4968.048Zm-132.5-1.482a1.833,1.833,0,0,1,2.032-1.894,1.786,1.786,0,0,1,1.828,2.058,1.868,1.868,0,0,1-2,1.934A1.954,1.954,0,0,1-14472.189-4969.53Zm171.328-6.3a13.333,13.333,0,0,1-8.241,3.445A14.289,14.289,0,0,1-14300.861-4975.834Zm-206.571.674a2.471,2.471,0,0,1-2.43-2.99,2.5,2.5,0,0,1,2.725-2.356,2.812,2.812,0,0,1,2.768,2.681c-.367,1.674-1.219,2.681-2.734,2.681C-14507.21-4975.146-14507.32-4975.151-14507.433-4975.161Zm181.322-2.961c.972-1.876,1.5-4.174,3.233-4.261,1.5-.08,2.28,2.13,3.133,3.81a8.671,8.671,0,0,1-3.455.626C-14324.117-4977.947-14325.073-4978.034-14326.11-4978.122Zm-141.37-9.444a16.744,16.744,0,0,1,.849-2.192c1.533,1.173,3.521,2.455,3.227,3.832-.36,1.693-2.768,1.792-4.814,2.5C-14467.936-4985.071-14467.769-4986.331-14467.48-4987.565Zm-16.338,2.185a1.164,1.164,0,0,0-1.057-.215c-4.374,2.186-4.05-1.129-4.225-3.824-1.9.528-3.955,2.178-4.916-.907a1.677,1.677,0,0,1,.31-1.453c.688-.6,1.132-.149,1.285.638.116.608.488.994,1.078.7,4.429-2.2,3.98,1.133,4.2,3.722a2.383,2.383,0,0,0,1.6-.372,2.24,2.24,0,0,1,1.767-.324c.987.321,1.66.863,1.7,1.9.019.466-.164,1.224-.477,1.369a1.385,1.385,0,0,1-.554.155C-14483.754-4983.987-14483.479-4985.011-14483.818-4985.38Zm133.711-.462-1.621-1.621a1.3,1.3,0,0,1,0-1.839l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.839l-1.621,1.621a1.294,1.294,0,0,1-.918.38A1.3,1.3,0,0,1-14350.107-4985.843Zm24.277-10.121a12.917,12.917,0,0,1-4.662,7.579A16.015,16.015,0,0,1-14325.83-4995.964Z" transform="translate(15609.956 5173.674)" fill="#ff505c" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                                        <path id="Path_1764" data-name="Path 1764" d="M1237.462,247.13s.391,9.109-5.8,6.531c0,0,2.1-3.752-1.461-5.465,0,0-2.581-2.489-.526-4.79h27.771s5.787-.127,5.3,4.753h-14.97s-3.817-.637-4.028,2.322-.707,3.063-2.594,3.348-2.679-1.167-2.333-3.718S1237.462,247.13,1237.462,247.13Z" transform="translate(-26.672 -20.172)" fill="#b98c1d"/>
                                        <path id="Path_1765" data-name="Path 1765" d="M1289.136,239.483c-1.7-17.863-21.507-13.843-23.607-8.234s-7.736,4.137-7.736,4.137-20.914-.048-25.336,0-3.011,4.583-3.011,4.583l27.667-.041c6.2-.153,5.837,5.112,5.837,5.112C1265.528,256.706,1290.836,257.346,1289.136,239.483Zm-13.487,6.358a5.634,5.634,0,1,1,5.634-5.634A5.635,5.635,0,0,1,1275.65,245.841Z" transform="translate(-26.745 -16.719)" fill="#ffc626"/>
                                    </g>
                                </svg>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 25px; font-size: 18px; color: #000000; font-family: Roboto;text-align:center;font-weight:600;">
                                Assalamoalikum dear ${user.firstname},
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0 25px 0;">
                                <table style="width: 100%;">
                                    <tbody>
                                        <tr>
                                            <td style="font-size: 13px; font-family: Roboto; color: #000000;text-align:center;">
                                      
                                          آپ کا کمبوہ ویلفیئر انجمن کراچی کو بھیجا گیا فنڈ
                                          ${user.amount}
                                          وصول کر دیا گیا ہے۔ آپ کے تعاون کا بیحد شکریہ۔
                                            <br/><br/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;padding:20px 0px;font-family: Roboto;font-size:16px;">
                                                <span style="font-size:14px">From,</span>
                                                <br/>
                                                Kamboh welfare anjuman Karachi.
                                                <br/>
                                                <br/>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
</div>
</body>

          `
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email successfuly send to member")
                    }
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

console.log(req.body)

var specificcontacts=[req.body.contacts]
var allcontacts=[req.body.allemailcontacts]

var mailOptions = {
    from: 'kambohwelfareanjumankarachi@gmail.com',
    to: req.body.contacts ? specificcontacts : allcontacts,
    subject: 'Alert Message',
    html: `
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
<style>
body,
html {
padding: 0;
margin: 0;
}

sup {
font-size: 6px;
}

@media screen and (max-width:600px) {
table {
width: 100% !important;
}
.parentDiv {
width: 100% !important;
padding: 0 !important;
}
.bottomContent{
padding:0px 10px;
}
}
</style>
</head>
<body style="display:flex;justify-content:center;">
<div class="parentDiv" style="width:100%;background:#F3F7FA;display:flex;flex-direction:column;align-items:center;padding:0px 20px;">
<div style="padding:15px 0px;font-size:40px;color:#E70030;font-family:Roboto;font-weight:bold">
<svg id="Group_1778" data-name="Group 1778" xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewbox="0 0 115.818 22.742">
<g id="Group_2" data-name="Group 2">
<path id="Path_4" data-name="Path 4" d="M1100.989,1001.741a2.246,2.246,0,1,1,2.259,2.234A2.206,2.206,0,0,1,1100.989,1001.741Zm.337,16.742V1005.32h3.771v13.162Z" transform="translate(-1100.989 -999.507)" fill="#e70030"/>
<path id="Path_5" data-name="Path 5" d="M1121.381,1011.932a6.58,6.58,0,0,1-6.557,6.917,4.967,4.967,0,0,1-3.939-1.8v1.465h-3.65v-18.279H1111v6.414a5.065,5.065,0,0,1,3.819-1.633A6.594,6.594,0,0,1,1121.381,1011.932Zm-3.843-.024a3.3,3.3,0,0,0-3.339-3.435,3.461,3.461,0,1,0,3.339,3.435Z" transform="translate(-1101.252 -999.538)" fill="#e70030"/>
<path id="Path_6" data-name="Path 6" d="M1136.157,1013.415h-9.681a3.363,3.363,0,0,0,3.579,2.474,7.9,7.9,0,0,0,4.107-1.273l1.49,2.57a9.731,9.731,0,0,1-5.765,1.826c-4.923,0-7.206-3.315-7.206-6.893a6.647,6.647,0,0,1,6.942-6.894,6.263,6.263,0,0,1,6.653,6.605A11.78,11.78,0,0,1,1136.157,1013.415Zm-9.7-2.69h6.2a2.965,2.965,0,0,0-3.026-2.45C1128.086,1008.275,1126.452,1010.725,1126.452,1010.725Z" transform="translate(-1101.904 -999.748)" fill="#e70030"/>
<path id="Path_7" data-name="Path 7" d="M1145.33,1018.738l-2.282-4.107-2.426,4.107h-4.3l4.252-6.677-3.771-6.485h4.3l2.017,3.843,2.21-3.843h4.228l-4.011,6.557,4.131,6.605Z" transform="translate(-1102.479 -999.763)" fill="#e70030"/>
<path id="Path_8" data-name="Path 8" d="M1150.467,1017.421a2.1,2.1,0,0,1,4.2,0,2.1,2.1,0,1,1-4.2,0Z" transform="translate(-1103.075 -1000.174)" fill="#e70030"/>
</g>
<path id="Path_1768" data-name="Path 1768" d="M11.022-10.032a5.159,5.159,0,0,0-4.2-2.024A5.608,5.608,0,0,0,2.6-10.318,5.956,5.956,0,0,0,.924-5.962,6.29,6.29,0,0,0,2.6-1.5,5.566,5.566,0,0,0,6.82.286a5.151,5.151,0,0,0,4.2-1.98V0h1.892V-11.77H11.022ZM11.176-5.9A4.508,4.508,0,0,1,10.01-2.772,3.871,3.871,0,0,1,7.018-1.518,3.871,3.871,0,0,1,4.026-2.772,4.56,4.56,0,0,1,2.9-5.874a4.482,4.482,0,0,1,1.122-3.1,3.815,3.815,0,0,1,2.992-1.276A3.815,3.815,0,0,1,10.01-8.976,4.4,4.4,0,0,1,11.176-5.9ZM24.728-10.23a5.128,5.128,0,0,0-4.092-1.826,5.774,5.774,0,0,0-4.268,1.738,5.823,5.823,0,0,0-1.738,4.29,5.977,5.977,0,0,0,1.694,4.312A5.608,5.608,0,0,0,20.548.022a5.225,5.225,0,0,0,4.18-1.848v.968A3.83,3.83,0,0,1,23.54,2.068a4.238,4.238,0,0,1-3.124,1.144,6.927,6.927,0,0,1-4.2-1.43l-.946,1.562a8.556,8.556,0,0,0,5.148,1.65A6.147,6.147,0,0,0,24.97,3.322,6.036,6.036,0,0,0,26.686-1.21V-11.77H24.728Zm-3.982-.044a3.882,3.882,0,0,1,2.948,1.21,4.182,4.182,0,0,1,1.188,3.036A4.233,4.233,0,0,1,23.694-2.97a3.882,3.882,0,0,1-2.948,1.21,3.964,3.964,0,0,1-2.97-1.21A4.272,4.272,0,0,1,16.61-6.028a4.255,4.255,0,0,1,1.166-3.036A3.9,3.9,0,0,1,20.746-10.274ZM40-6.094a5.956,5.956,0,0,0-1.584-4.356,5.453,5.453,0,0,0-4.07-1.606,5.605,5.605,0,0,0-4.268,1.738,6.135,6.135,0,0,0-1.65,4.4A5.831,5.831,0,0,0,34.672.264a8.6,8.6,0,0,0,5.038-1.65L38.874-2.9a7.719,7.719,0,0,1-4.158,1.342,3.9,3.9,0,0,1-4.224-3.5H39.93C39.974-5.588,40-5.94,40-6.094Zm-5.654-4.18A3.473,3.473,0,0,1,37.928-6.82H30.492A3.857,3.857,0,0,1,34.342-10.274ZM43.626,0V-6.556a3.845,3.845,0,0,1,.924-2.662,3.08,3.08,0,0,1,2.4-1.034c1.826,0,3.08,1.32,3.08,3.7V0h1.958V-7.128A4.8,4.8,0,0,0,50.644-10.8a4.617,4.617,0,0,0-3.322-1.276,3.962,3.962,0,0,0-3.74,1.98V-11.77H41.668V0ZM60.94-2.222a4.086,4.086,0,0,1-2.134.7c-1.3,0-1.936-.792-1.936-2.376v-6.182h4.2V-11.77h-4.2v-4.158H54.934v4.158H52.822v1.694h2.09v5.984C54.912-1.3,56.166.286,58.63.286A4.831,4.831,0,0,0,61.71-.7Z" transform="translate(54.108 17.748)" fill="#656565"/>
</svg>
</div>
<table style="background: #ffffff" width="100%" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td width="100%">
<table width="100%" cellspacing="0" cellpadding="0">
    <tbody>
        <tr>
            <td style="width:100%;display:flex;justify-content:center;padding:20px 0px;font-family: Roboto;font-size:20px">
                <svg xmlns="http://www.w3.org/2000/svg" width="212.987" height="124.358" viewbox="0 0 212.987 124.358" style="padding:20px 0px;">
                    <g id="Group_1156" data-name="Group 1156" transform="translate(-1097.723 -144.607)">
                        <path id="Path_6998" data-name="Path 6998" d="M40.115,0A40.115,40.115,0,1,1,0,40.115,40.115,40.115,0,0,1,40.115,0Z" transform="translate(1160.575 171.801)" fill="#2a7ec2"/>
                        <path id="Path_6997" data-name="Path 6997" d="M28.2,0A28.2,28.2,0,1,1,0,28.2,28.2,28.2,0,0,1,28.2,0Z" transform="translate(1172.491 183.718)" fill="#1c598d"/>
                        <path id="Path_1741" data-name="Path 1741" d="M1201.641,177.466l-7.968,4.814c-.013-5.41-.527-10.83.495-16.215a26.3,26.3,0,0,1,27.042-21.417c13.6.772,23.911,10.69,25.026,24.063v12.67a25.369,25.369,0,0,1-7.5-4.713c-.013-1.979.051-3.963-.054-5.937-.538-10.136-7.907-17.69-17.819-18.323-8.861-.565-17.141,6.005-19.018,15.2C1201.179,170.858,1201.471,174.173,1201.641,177.466Z" transform="translate(-19.456 0)" fill="#1c598d"/>
                        <path id="Path_1762" data-name="Path 1762" d="M1226.661,235.809c-.155,2.1-.922,4.13,2.016,5.447,1.245.557.316,3.145.48,4.8-3.564.025-7.135-.056-10.693.109-2.571.119-3.256-.817-2.682-3.273,1.2-5.134,2.145-10.327,3.368-15.455a5.421,5.421,0,0,0-1.144-5.408,8.426,8.426,0,0,1,.661-11.784,8.877,8.877,0,0,1,11.9-.092c3.325,3.078,3.994,8.37.814,11.764-3.048,3.253-.5,6.185-.389,9.26C1227.847,231.13,1225.658,231.975,1226.661,235.809Z" transform="translate(-23.96 -12.925)" fill="#392d2b"/>
                        <path id="Path_6995" data-name="Path 6995" d="M-14455.474-4887.985c-1.81-.033-.8-2.1-1.074-3.256a1.873,1.873,0,0,1,0-.79c.292-1.446-.754-4.079.886-4.123,2.37-.062,1.085,2.641,1.5,3.85,0,.532.019.8,0,1.06-.108,1.249.3,3.259-1.271,3.26Zm-39.312-17.081c1.665-1.566,2.758-3.857,5.277-4.356.2-.04.769.539.722.667-.9,2.426-3.161,3.675-4.808,5.459-.16.175-.463.218-.714.332C-14495.5-4903.43-14495.582-4904.308-14494.785-4905.065Zm76.332.35a8.088,8.088,0,0,1-1.719-1.584c-1.107-1.387-3.056-2.152-3.292-4.155-.065-.546.725-.816,1.194-.546a17,17,0,0,1,5.361,5.212c-.052.939-.331,1.371-.779,1.371A1.451,1.451,0,0,1-14418.453-4904.716Zm-90.979-35.95c-1.162.083-2.266.171-2.28-1.166-.025-2.018,2.546-1.216,3.923-1.136a8.658,8.658,0,0,0,1.482-.12c1.453-.2,3-.39,3.016,1.391,0,1.191-1.191,1.107-2.444,1.023a5.666,5.666,0,0,0-1.952.083A4.651,4.651,0,0,0-14509.433-4940.666Zm17.762-34.111c-1.649-1.475-3.205-3.059-4.716-4.673-.692-.739-.525-1.424.506-1.653,1.125-.083,5.8,4.469,5.751,5.587-.035.715-.351,1.1-.772,1.1A1.206,1.206,0,0,1-14491.671-4974.776Zm66.685-1.868a1.291,1.291,0,0,1,.3-1.755q2.186-2.246,4.433-4.425a1.251,1.251,0,0,1,1.752-.24c.339.284.706,1.052.557,1.3-1.42,2.386-3.648,4-5.674,6.024A5.612,5.612,0,0,1-14424.986-4976.645Zm-32.789-11.479c-2.007-.033-.845-2.583-1.14-4.006a5.662,5.662,0,0,1,0-1.584c.076-.878-.189-2.16,1.03-2.244,1.617-.113,1.2,1.369,1.322,2.327a16.489,16.489,0,0,1,.011,1.828c-.387,1.129.837,3.679-1.185,3.679Z" transform="translate(15658.448 5156.449)" fill="#c6d7ef" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                        <path id="Path_6996" data-name="Path 6996" d="M-14430.136-4907.344l-1.621-1.621a1.293,1.293,0,0,1,0-1.835l1.621-1.621a1.292,1.292,0,0,1,1.835,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.288,1.288,0,0,1-.917.382A1.288,1.288,0,0,1-14430.136-4907.344Zm80.989-16.677a2.494,2.494,0,0,1,2.491-2.495,2.494,2.494,0,0,1,2.5,2.495,2.491,2.491,0,0,1-2.5,2.495A2.491,2.491,0,0,1-14349.146-4924.021Zm-127.362,1.807a1.93,1.93,0,0,1-2-2.029,1.834,1.834,0,0,1,2.01-1.963,1.764,1.764,0,0,1,1.974,1.963,1.894,1.894,0,0,1-1.95,2.029Zm152.292-5.026a2.866,2.866,0,0,1,2.862-2.866,2.863,2.863,0,0,1,2.862,2.866,2.86,2.86,0,0,1-2.862,2.862A2.863,2.863,0,0,1-14324.217-4927.24Zm-12.729-8.453-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.293,1.293,0,0,1-.918.379A1.3,1.3,0,0,1-14336.945-4935.693Zm-160.854-.8-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.3,1.3,0,0,1-.921.38A1.294,1.294,0,0,1-14497.8-4936.494Zm185.387-6.5c2.87.8,5.627,1.865,7.651,4.232C-14307.857-4939.12-14310.254-4940.813-14312.413-4943Zm-150.519,1.489a1.875,1.875,0,0,1,1.7-2.072c1.377.08,2.175.67,2.219,1.909a1.823,1.823,0,0,1-1.887,2.04c-.05,0-.1,0-.146,0A1.781,1.781,0,0,1-14462.932-4941.509Zm137.1-11.792c-.754-1.927-1.278-2.539-3.14-.933-1.121.965-2.549.343-3.193-1.11-.168-.372.12-.951.2-1.432,1.242,1.512,2.236.8,3.245.087.721-.51,1.449-1.02,2.279-.707,1.508.564,1.559,1.981,2.262,3.369a19.682,19.682,0,0,1,2.8-1.777,1.677,1.677,0,0,1,2.051.779c.295.5.524,1.431.262,1.8-.8,1.129-1.158-.342-1.773-.492-.994-.244-1.257.772-1.919,1.093a3.547,3.547,0,0,1-1.482.375A1.589,1.589,0,0,1-14325.834-4953.3Zm-154.947.04a1.914,1.914,0,0,1-1.915-2.058,1.847,1.847,0,0,1,2.064-1.861c1.274.007,1.851.769,1.872,2-.146,1.144-.761,1.92-1.87,1.92C-14480.68-4953.257-14480.729-4953.259-14480.781-4953.262Zm175.5-6.687c2.087-.761,3.682.211,5.423.754a11.059,11.059,0,0,1-2.929,4.866C-14303.713-4956.416-14304.456-4958.091-14305.278-4959.948Zm-206.434,3.806a18.375,18.375,0,0,1,8.871-.6l.073,1.162-8.883.48Zm20.777-11.29a2.864,2.864,0,0,1,2.866-2.863,2.863,2.863,0,0,1,2.862,2.863,2.863,2.863,0,0,1-2.862,2.863A2.864,2.864,0,0,1-14490.935-4967.433Zm151.25-.616a2.863,2.863,0,0,1,2.863-2.862,2.86,2.86,0,0,1,2.862,2.862,2.861,2.861,0,0,1-2.862,2.863A2.863,2.863,0,0,1-14339.685-4968.048Zm-132.5-1.482a1.833,1.833,0,0,1,2.032-1.894,1.786,1.786,0,0,1,1.828,2.058,1.868,1.868,0,0,1-2,1.934A1.954,1.954,0,0,1-14472.189-4969.53Zm171.328-6.3a13.333,13.333,0,0,1-8.241,3.445A14.289,14.289,0,0,1-14300.861-4975.834Zm-206.571.674a2.471,2.471,0,0,1-2.43-2.99,2.5,2.5,0,0,1,2.725-2.356,2.812,2.812,0,0,1,2.768,2.681c-.367,1.674-1.219,2.681-2.734,2.681C-14507.21-4975.146-14507.32-4975.151-14507.433-4975.161Zm181.322-2.961c.972-1.876,1.5-4.174,3.233-4.261,1.5-.08,2.28,2.13,3.133,3.81a8.671,8.671,0,0,1-3.455.626C-14324.117-4977.947-14325.073-4978.034-14326.11-4978.122Zm-141.37-9.444a16.744,16.744,0,0,1,.849-2.192c1.533,1.173,3.521,2.455,3.227,3.832-.36,1.693-2.768,1.792-4.814,2.5C-14467.936-4985.071-14467.769-4986.331-14467.48-4987.565Zm-16.338,2.185a1.164,1.164,0,0,0-1.057-.215c-4.374,2.186-4.05-1.129-4.225-3.824-1.9.528-3.955,2.178-4.916-.907a1.677,1.677,0,0,1,.31-1.453c.688-.6,1.132-.149,1.285.638.116.608.488.994,1.078.7,4.429-2.2,3.98,1.133,4.2,3.722a2.383,2.383,0,0,0,1.6-.372,2.24,2.24,0,0,1,1.767-.324c.987.321,1.66.863,1.7,1.9.019.466-.164,1.224-.477,1.369a1.385,1.385,0,0,1-.554.155C-14483.754-4983.987-14483.479-4985.011-14483.818-4985.38Zm133.711-.462-1.621-1.621a1.3,1.3,0,0,1,0-1.839l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.839l-1.621,1.621a1.294,1.294,0,0,1-.918.38A1.3,1.3,0,0,1-14350.107-4985.843Zm24.277-10.121a12.917,12.917,0,0,1-4.662,7.579A16.015,16.015,0,0,1-14325.83-4995.964Z" transform="translate(15609.956 5173.674)" fill="#ff505c" stroke="rgba(0,0,0,0)" stroke-width="1"/>
                        <path id="Path_1764" data-name="Path 1764" d="M1237.462,247.13s.391,9.109-5.8,6.531c0,0,2.1-3.752-1.461-5.465,0,0-2.581-2.489-.526-4.79h27.771s5.787-.127,5.3,4.753h-14.97s-3.817-.637-4.028,2.322-.707,3.063-2.594,3.348-2.679-1.167-2.333-3.718S1237.462,247.13,1237.462,247.13Z" transform="translate(-26.672 -20.172)" fill="#b98c1d"/>
                        <path id="Path_1765" data-name="Path 1765" d="M1289.136,239.483c-1.7-17.863-21.507-13.843-23.607-8.234s-7.736,4.137-7.736,4.137-20.914-.048-25.336,0-3.011,4.583-3.011,4.583l27.667-.041c6.2-.153,5.837,5.112,5.837,5.112C1265.528,256.706,1290.836,257.346,1289.136,239.483Zm-13.487,6.358a5.634,5.634,0,1,1,5.634-5.634A5.635,5.635,0,0,1,1275.65,245.841Z" transform="translate(-26.745 -16.719)" fill="#ffc626"/>
                    </g>
                </svg>
            </td>
        </tr>
        <tr>
            <td style="padding: 10px 25px; font-size: 18px; color: #000000; font-family: Roboto;text-align:center;font-weight:600;">
                Assalamoalikum dear,
            </td>
        </tr>
        <tr>
            <td style="padding: 0 25px 0;">
                <table style="width: 100%;">
                    <tbody>
                        <tr>
                            <td style="font-size: 13px; font-family: Roboto; color: #000000;text-align:center;">
                      
                                       ${req.body.writemessagetext}
                            <br/><br/>
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align:center;padding:20px 0px;font-family: Roboto;font-size:16px;">
                                <span style="font-size:14px">From,</span>
                                <br/>
                                Kamboh welfare anjuman Karachi.
                                <br/>
                                <br/>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</body>

`
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Email successfuly send to members")
        res.send(info)
    }
});

})


router.post('/postjob', (req, res) => {
    
    const newPostjob = new Postjob({
        jobtitle: req.body.jobtitle,
        jobdesc: req.body.jobdesc,
        link: req.body.link,
        jobcontact: req.body.jobcontact,
        date: req.body.date,
        joboption:req.body.joboption
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


// router.post('/autoemail', (req, res) => {

//     var mailOptions = {
//         from: 'kambohwelfareanjumankarachi@gmail.com',
//         to: req.body,
//         subject: 'monthly fees reminder email',
//         html: `
//     <head>
//     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
//     <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
//     <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
//     <style>
//     body,
//     html {
//     padding: 0;
//     margin: 0;
//     }
    
//     sup {
//     font-size: 6px;
//     }
    
//     @media screen and (max-width:600px) {
//     table {
//     width: 100% !important;
//     }
//     .parentDiv {
//     width: 100% !important;
//     padding: 0 !important;
//     }
//     .bottomContent{
//     padding:0px 10px;
//     }
//     }
//     </style>
//     </head>
//     <body style="display:flex;justify-content:center;">
//     <div class="parentDiv" style="width:100%;background:#F3F7FA;display:flex;flex-direction:column;align-items:center;padding:0px 20px;">
//     <div style="padding:15px 0px;font-size:40px;color:#E70030;font-family:Roboto;font-weight:bold">
//     <svg id="Group_1778" data-name="Group 1778" xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewbox="0 0 115.818 22.742">
//     <g id="Group_2" data-name="Group 2">
//     <path id="Path_4" data-name="Path 4" d="M1100.989,1001.741a2.246,2.246,0,1,1,2.259,2.234A2.206,2.206,0,0,1,1100.989,1001.741Zm.337,16.742V1005.32h3.771v13.162Z" transform="translate(-1100.989 -999.507)" fill="#e70030"/>
//     <path id="Path_5" data-name="Path 5" d="M1121.381,1011.932a6.58,6.58,0,0,1-6.557,6.917,4.967,4.967,0,0,1-3.939-1.8v1.465h-3.65v-18.279H1111v6.414a5.065,5.065,0,0,1,3.819-1.633A6.594,6.594,0,0,1,1121.381,1011.932Zm-3.843-.024a3.3,3.3,0,0,0-3.339-3.435,3.461,3.461,0,1,0,3.339,3.435Z" transform="translate(-1101.252 -999.538)" fill="#e70030"/>
//     <path id="Path_6" data-name="Path 6" d="M1136.157,1013.415h-9.681a3.363,3.363,0,0,0,3.579,2.474,7.9,7.9,0,0,0,4.107-1.273l1.49,2.57a9.731,9.731,0,0,1-5.765,1.826c-4.923,0-7.206-3.315-7.206-6.893a6.647,6.647,0,0,1,6.942-6.894,6.263,6.263,0,0,1,6.653,6.605A11.78,11.78,0,0,1,1136.157,1013.415Zm-9.7-2.69h6.2a2.965,2.965,0,0,0-3.026-2.45C1128.086,1008.275,1126.452,1010.725,1126.452,1010.725Z" transform="translate(-1101.904 -999.748)" fill="#e70030"/>
//     <path id="Path_7" data-name="Path 7" d="M1145.33,1018.738l-2.282-4.107-2.426,4.107h-4.3l4.252-6.677-3.771-6.485h4.3l2.017,3.843,2.21-3.843h4.228l-4.011,6.557,4.131,6.605Z" transform="translate(-1102.479 -999.763)" fill="#e70030"/>
//     <path id="Path_8" data-name="Path 8" d="M1150.467,1017.421a2.1,2.1,0,0,1,4.2,0,2.1,2.1,0,1,1-4.2,0Z" transform="translate(-1103.075 -1000.174)" fill="#e70030"/>
//     </g>
//     <path id="Path_1768" data-name="Path 1768" d="M11.022-10.032a5.159,5.159,0,0,0-4.2-2.024A5.608,5.608,0,0,0,2.6-10.318,5.956,5.956,0,0,0,.924-5.962,6.29,6.29,0,0,0,2.6-1.5,5.566,5.566,0,0,0,6.82.286a5.151,5.151,0,0,0,4.2-1.98V0h1.892V-11.77H11.022ZM11.176-5.9A4.508,4.508,0,0,1,10.01-2.772,3.871,3.871,0,0,1,7.018-1.518,3.871,3.871,0,0,1,4.026-2.772,4.56,4.56,0,0,1,2.9-5.874a4.482,4.482,0,0,1,1.122-3.1,3.815,3.815,0,0,1,2.992-1.276A3.815,3.815,0,0,1,10.01-8.976,4.4,4.4,0,0,1,11.176-5.9ZM24.728-10.23a5.128,5.128,0,0,0-4.092-1.826,5.774,5.774,0,0,0-4.268,1.738,5.823,5.823,0,0,0-1.738,4.29,5.977,5.977,0,0,0,1.694,4.312A5.608,5.608,0,0,0,20.548.022a5.225,5.225,0,0,0,4.18-1.848v.968A3.83,3.83,0,0,1,23.54,2.068a4.238,4.238,0,0,1-3.124,1.144,6.927,6.927,0,0,1-4.2-1.43l-.946,1.562a8.556,8.556,0,0,0,5.148,1.65A6.147,6.147,0,0,0,24.97,3.322,6.036,6.036,0,0,0,26.686-1.21V-11.77H24.728Zm-3.982-.044a3.882,3.882,0,0,1,2.948,1.21,4.182,4.182,0,0,1,1.188,3.036A4.233,4.233,0,0,1,23.694-2.97a3.882,3.882,0,0,1-2.948,1.21,3.964,3.964,0,0,1-2.97-1.21A4.272,4.272,0,0,1,16.61-6.028a4.255,4.255,0,0,1,1.166-3.036A3.9,3.9,0,0,1,20.746-10.274ZM40-6.094a5.956,5.956,0,0,0-1.584-4.356,5.453,5.453,0,0,0-4.07-1.606,5.605,5.605,0,0,0-4.268,1.738,6.135,6.135,0,0,0-1.65,4.4A5.831,5.831,0,0,0,34.672.264a8.6,8.6,0,0,0,5.038-1.65L38.874-2.9a7.719,7.719,0,0,1-4.158,1.342,3.9,3.9,0,0,1-4.224-3.5H39.93C39.974-5.588,40-5.94,40-6.094Zm-5.654-4.18A3.473,3.473,0,0,1,37.928-6.82H30.492A3.857,3.857,0,0,1,34.342-10.274ZM43.626,0V-6.556a3.845,3.845,0,0,1,.924-2.662,3.08,3.08,0,0,1,2.4-1.034c1.826,0,3.08,1.32,3.08,3.7V0h1.958V-7.128A4.8,4.8,0,0,0,50.644-10.8a4.617,4.617,0,0,0-3.322-1.276,3.962,3.962,0,0,0-3.74,1.98V-11.77H41.668V0ZM60.94-2.222a4.086,4.086,0,0,1-2.134.7c-1.3,0-1.936-.792-1.936-2.376v-6.182h4.2V-11.77h-4.2v-4.158H54.934v4.158H52.822v1.694h2.09v5.984C54.912-1.3,56.166.286,58.63.286A4.831,4.831,0,0,0,61.71-.7Z" transform="translate(54.108 17.748)" fill="#656565"/>
//     </svg>
//     </div>
//     <table style="background: #ffffff" width="100%" cellspacing="0" cellpadding="0">
//     <tbody>
//     <tr>
//     <td width="100%">
//     <table width="100%" cellspacing="0" cellpadding="0">
//         <tbody>
//             <tr>
//                 <td style="width:100%;display:flex;justify-content:center;padding:20px 0px;font-family: Roboto;font-size:20px">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="212.987" height="124.358" viewbox="0 0 212.987 124.358" style="padding:20px 0px;">
//                         <g id="Group_1156" data-name="Group 1156" transform="translate(-1097.723 -144.607)">
//                             <path id="Path_6998" data-name="Path 6998" d="M40.115,0A40.115,40.115,0,1,1,0,40.115,40.115,40.115,0,0,1,40.115,0Z" transform="translate(1160.575 171.801)" fill="#2a7ec2"/>
//                             <path id="Path_6997" data-name="Path 6997" d="M28.2,0A28.2,28.2,0,1,1,0,28.2,28.2,28.2,0,0,1,28.2,0Z" transform="translate(1172.491 183.718)" fill="#1c598d"/>
//                             <path id="Path_1741" data-name="Path 1741" d="M1201.641,177.466l-7.968,4.814c-.013-5.41-.527-10.83.495-16.215a26.3,26.3,0,0,1,27.042-21.417c13.6.772,23.911,10.69,25.026,24.063v12.67a25.369,25.369,0,0,1-7.5-4.713c-.013-1.979.051-3.963-.054-5.937-.538-10.136-7.907-17.69-17.819-18.323-8.861-.565-17.141,6.005-19.018,15.2C1201.179,170.858,1201.471,174.173,1201.641,177.466Z" transform="translate(-19.456 0)" fill="#1c598d"/>
//                             <path id="Path_1762" data-name="Path 1762" d="M1226.661,235.809c-.155,2.1-.922,4.13,2.016,5.447,1.245.557.316,3.145.48,4.8-3.564.025-7.135-.056-10.693.109-2.571.119-3.256-.817-2.682-3.273,1.2-5.134,2.145-10.327,3.368-15.455a5.421,5.421,0,0,0-1.144-5.408,8.426,8.426,0,0,1,.661-11.784,8.877,8.877,0,0,1,11.9-.092c3.325,3.078,3.994,8.37.814,11.764-3.048,3.253-.5,6.185-.389,9.26C1227.847,231.13,1225.658,231.975,1226.661,235.809Z" transform="translate(-23.96 -12.925)" fill="#392d2b"/>
//                             <path id="Path_6995" data-name="Path 6995" d="M-14455.474-4887.985c-1.81-.033-.8-2.1-1.074-3.256a1.873,1.873,0,0,1,0-.79c.292-1.446-.754-4.079.886-4.123,2.37-.062,1.085,2.641,1.5,3.85,0,.532.019.8,0,1.06-.108,1.249.3,3.259-1.271,3.26Zm-39.312-17.081c1.665-1.566,2.758-3.857,5.277-4.356.2-.04.769.539.722.667-.9,2.426-3.161,3.675-4.808,5.459-.16.175-.463.218-.714.332C-14495.5-4903.43-14495.582-4904.308-14494.785-4905.065Zm76.332.35a8.088,8.088,0,0,1-1.719-1.584c-1.107-1.387-3.056-2.152-3.292-4.155-.065-.546.725-.816,1.194-.546a17,17,0,0,1,5.361,5.212c-.052.939-.331,1.371-.779,1.371A1.451,1.451,0,0,1-14418.453-4904.716Zm-90.979-35.95c-1.162.083-2.266.171-2.28-1.166-.025-2.018,2.546-1.216,3.923-1.136a8.658,8.658,0,0,0,1.482-.12c1.453-.2,3-.39,3.016,1.391,0,1.191-1.191,1.107-2.444,1.023a5.666,5.666,0,0,0-1.952.083A4.651,4.651,0,0,0-14509.433-4940.666Zm17.762-34.111c-1.649-1.475-3.205-3.059-4.716-4.673-.692-.739-.525-1.424.506-1.653,1.125-.083,5.8,4.469,5.751,5.587-.035.715-.351,1.1-.772,1.1A1.206,1.206,0,0,1-14491.671-4974.776Zm66.685-1.868a1.291,1.291,0,0,1,.3-1.755q2.186-2.246,4.433-4.425a1.251,1.251,0,0,1,1.752-.24c.339.284.706,1.052.557,1.3-1.42,2.386-3.648,4-5.674,6.024A5.612,5.612,0,0,1-14424.986-4976.645Zm-32.789-11.479c-2.007-.033-.845-2.583-1.14-4.006a5.662,5.662,0,0,1,0-1.584c.076-.878-.189-2.16,1.03-2.244,1.617-.113,1.2,1.369,1.322,2.327a16.489,16.489,0,0,1,.011,1.828c-.387,1.129.837,3.679-1.185,3.679Z" transform="translate(15658.448 5156.449)" fill="#c6d7ef" stroke="rgba(0,0,0,0)" stroke-width="1"/>
//                             <path id="Path_6996" data-name="Path 6996" d="M-14430.136-4907.344l-1.621-1.621a1.293,1.293,0,0,1,0-1.835l1.621-1.621a1.292,1.292,0,0,1,1.835,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.288,1.288,0,0,1-.917.382A1.288,1.288,0,0,1-14430.136-4907.344Zm80.989-16.677a2.494,2.494,0,0,1,2.491-2.495,2.494,2.494,0,0,1,2.5,2.495,2.491,2.491,0,0,1-2.5,2.495A2.491,2.491,0,0,1-14349.146-4924.021Zm-127.362,1.807a1.93,1.93,0,0,1-2-2.029,1.834,1.834,0,0,1,2.01-1.963,1.764,1.764,0,0,1,1.974,1.963,1.894,1.894,0,0,1-1.95,2.029Zm152.292-5.026a2.866,2.866,0,0,1,2.862-2.866,2.863,2.863,0,0,1,2.862,2.866,2.86,2.86,0,0,1-2.862,2.862A2.863,2.863,0,0,1-14324.217-4927.24Zm-12.729-8.453-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.293,1.293,0,0,1-.918.379A1.3,1.3,0,0,1-14336.945-4935.693Zm-160.854-.8-1.621-1.621a1.3,1.3,0,0,1,0-1.835l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.835l-1.621,1.621a1.3,1.3,0,0,1-.921.38A1.294,1.294,0,0,1-14497.8-4936.494Zm185.387-6.5c2.87.8,5.627,1.865,7.651,4.232C-14307.857-4939.12-14310.254-4940.813-14312.413-4943Zm-150.519,1.489a1.875,1.875,0,0,1,1.7-2.072c1.377.08,2.175.67,2.219,1.909a1.823,1.823,0,0,1-1.887,2.04c-.05,0-.1,0-.146,0A1.781,1.781,0,0,1-14462.932-4941.509Zm137.1-11.792c-.754-1.927-1.278-2.539-3.14-.933-1.121.965-2.549.343-3.193-1.11-.168-.372.12-.951.2-1.432,1.242,1.512,2.236.8,3.245.087.721-.51,1.449-1.02,2.279-.707,1.508.564,1.559,1.981,2.262,3.369a19.682,19.682,0,0,1,2.8-1.777,1.677,1.677,0,0,1,2.051.779c.295.5.524,1.431.262,1.8-.8,1.129-1.158-.342-1.773-.492-.994-.244-1.257.772-1.919,1.093a3.547,3.547,0,0,1-1.482.375A1.589,1.589,0,0,1-14325.834-4953.3Zm-154.947.04a1.914,1.914,0,0,1-1.915-2.058,1.847,1.847,0,0,1,2.064-1.861c1.274.007,1.851.769,1.872,2-.146,1.144-.761,1.92-1.87,1.92C-14480.68-4953.257-14480.729-4953.259-14480.781-4953.262Zm175.5-6.687c2.087-.761,3.682.211,5.423.754a11.059,11.059,0,0,1-2.929,4.866C-14303.713-4956.416-14304.456-4958.091-14305.278-4959.948Zm-206.434,3.806a18.375,18.375,0,0,1,8.871-.6l.073,1.162-8.883.48Zm20.777-11.29a2.864,2.864,0,0,1,2.866-2.863,2.863,2.863,0,0,1,2.862,2.863,2.863,2.863,0,0,1-2.862,2.863A2.864,2.864,0,0,1-14490.935-4967.433Zm151.25-.616a2.863,2.863,0,0,1,2.863-2.862,2.86,2.86,0,0,1,2.862,2.862,2.861,2.861,0,0,1-2.862,2.863A2.863,2.863,0,0,1-14339.685-4968.048Zm-132.5-1.482a1.833,1.833,0,0,1,2.032-1.894,1.786,1.786,0,0,1,1.828,2.058,1.868,1.868,0,0,1-2,1.934A1.954,1.954,0,0,1-14472.189-4969.53Zm171.328-6.3a13.333,13.333,0,0,1-8.241,3.445A14.289,14.289,0,0,1-14300.861-4975.834Zm-206.571.674a2.471,2.471,0,0,1-2.43-2.99,2.5,2.5,0,0,1,2.725-2.356,2.812,2.812,0,0,1,2.768,2.681c-.367,1.674-1.219,2.681-2.734,2.681C-14507.21-4975.146-14507.32-4975.151-14507.433-4975.161Zm181.322-2.961c.972-1.876,1.5-4.174,3.233-4.261,1.5-.08,2.28,2.13,3.133,3.81a8.671,8.671,0,0,1-3.455.626C-14324.117-4977.947-14325.073-4978.034-14326.11-4978.122Zm-141.37-9.444a16.744,16.744,0,0,1,.849-2.192c1.533,1.173,3.521,2.455,3.227,3.832-.36,1.693-2.768,1.792-4.814,2.5C-14467.936-4985.071-14467.769-4986.331-14467.48-4987.565Zm-16.338,2.185a1.164,1.164,0,0,0-1.057-.215c-4.374,2.186-4.05-1.129-4.225-3.824-1.9.528-3.955,2.178-4.916-.907a1.677,1.677,0,0,1,.31-1.453c.688-.6,1.132-.149,1.285.638.116.608.488.994,1.078.7,4.429-2.2,3.98,1.133,4.2,3.722a2.383,2.383,0,0,0,1.6-.372,2.24,2.24,0,0,1,1.767-.324c.987.321,1.66.863,1.7,1.9.019.466-.164,1.224-.477,1.369a1.385,1.385,0,0,1-.554.155C-14483.754-4983.987-14483.479-4985.011-14483.818-4985.38Zm133.711-.462-1.621-1.621a1.3,1.3,0,0,1,0-1.839l1.621-1.621a1.3,1.3,0,0,1,1.839,0l1.621,1.621a1.3,1.3,0,0,1,0,1.839l-1.621,1.621a1.294,1.294,0,0,1-.918.38A1.3,1.3,0,0,1-14350.107-4985.843Zm24.277-10.121a12.917,12.917,0,0,1-4.662,7.579A16.015,16.015,0,0,1-14325.83-4995.964Z" transform="translate(15609.956 5173.674)" fill="#ff505c" stroke="rgba(0,0,0,0)" stroke-width="1"/>
//                             <path id="Path_1764" data-name="Path 1764" d="M1237.462,247.13s.391,9.109-5.8,6.531c0,0,2.1-3.752-1.461-5.465,0,0-2.581-2.489-.526-4.79h27.771s5.787-.127,5.3,4.753h-14.97s-3.817-.637-4.028,2.322-.707,3.063-2.594,3.348-2.679-1.167-2.333-3.718S1237.462,247.13,1237.462,247.13Z" transform="translate(-26.672 -20.172)" fill="#b98c1d"/>
//                             <path id="Path_1765" data-name="Path 1765" d="M1289.136,239.483c-1.7-17.863-21.507-13.843-23.607-8.234s-7.736,4.137-7.736,4.137-20.914-.048-25.336,0-3.011,4.583-3.011,4.583l27.667-.041c6.2-.153,5.837,5.112,5.837,5.112C1265.528,256.706,1290.836,257.346,1289.136,239.483Zm-13.487,6.358a5.634,5.634,0,1,1,5.634-5.634A5.635,5.635,0,0,1,1275.65,245.841Z" transform="translate(-26.745 -16.719)" fill="#ffc626"/>
//                         </g>
//                     </svg>
//                 </td>
//             </tr>
//             <tr>
//                 <td style="padding: 10px 25px; font-size: 18px; color: #000000; font-family: Roboto;text-align:center;font-weight:600;">
//                     Assalamoalikum dear,
//                 </td>
//             </tr>
//             <tr>
//                 <td style="padding: 0 25px 0;">
//                     <table style="width: 100%;">
//                         <tbody>
//                             <tr>
//                                 <td style="font-size: 13px; font-family: Roboto; color: #000000;text-align:center;">
                          
//                                 معزز میمبر آپ نے اس مہینے کی ماہانہ فیس ابھی تک ادا نہیں کی۔ براہِ مہربانی آپ اپنی ماہانہ فیس کمبوہ ویلفیئر انجمن کراچی کے فیصل بینک اکاؤنٹ میں جمع کروائیں۔
                               
//                                 اگر آپ یہ ریکارڈ کمبوہ ویلفیئر انجمن کراچی کی ویبسائٹ اور اپنی پروفائل میں محفوظ کرنا چاہتے ہیں
                                
//                                 تو ویبسائٹ پر لاگ ان کر کے 
                              
                              
//                                 ڈونیٹ
                                
                              
//                                 میں جا کر اپنی رقم، ٹرانزیکشن 

//                                 ای ڈی

//                                  اور عطیات کا مقصد فارم میں درج کر کے بھیجیں۔
//                                 ایڈمن کی تصدیق کے بعد یہ ریکارڈ آپ کی پروفائل میں محفوظ کر دیا جائے گا
//                                 <br/><br/>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="text-align:center;padding:20px 0px;font-family: Roboto;font-size:16px;">
//                                     <span style="font-size:14px">From,</span>
//                                     <br/>
//                                     Kamboh welfare anjuman Karachi.
//                                     <br/>
//                                     <br/>
    
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </td>
//             </tr>
//         </tbody>
//     </table>
//     </td>
//     </tr>
//     </tbody>
//     </table>
//     </div>
//     </body>
    
//     `
//     };
    
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log("Email successfuly send to members")
//         }
//     });

   

// })


module.exports = router;
