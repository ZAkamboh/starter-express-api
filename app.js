const express = require("express")
const app = express();

const path = require("path")
const bodyparser = require("body-parser");
const mongoose = require('mongoose');





// const Vonage = require('@vonage/server-sdk')

// const vonage = new Vonage({
//   apiKey: "9ebd825b",
//   apiSecret: "Zfvb54QikIG0LSxp"
// })

// const numbers=['923312380673']

// const from = "Vonage APIs"
// const to = '923312380673'
// const text = 'checking sms functionality of KAMBOH WELFARE ANJUMAN KARACKI'

// vonage.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if(responseData.messages[0]['status'] === "0") {
//             console.log("Message sent successfully.");
//         } else {
//             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//         }
//     }
// })





// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://iconwood.com.pk');
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());




mongoose.connect("mongodb+srv://kambohwelfareanjumankarachi:kambohwelfareanjumankarachi1818@cluster0.djol0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => {
    console.log("successfully connect database");
}).catch(()=>{
    console.log("error in connecting database")
})




const data = require('./routes/data');

app.use('/data',data);

app.set('json spaces', 40);


var port=process.env.PORT || 8080
app.listen(port, (res) => {
    console.log(`working on port ${port}`)
})



    








