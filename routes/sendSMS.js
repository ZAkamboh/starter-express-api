const axios = require('axios');
const serviceURL = 'https://lifetimesms.com/plain?'

const sendSMS = async (phoneNo, message) => {
    try {
        const res = await axios.post(serviceURL, null, {
            params: {
                api_token: 'f1faf50d16befeab2ea4fccb7893a343d5b4486759',
                api_secret: 'kambohsms',
                to: phoneNo,
                from: 'Brand',
                message: message
            }
        });
        console.log("response", res);
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = sendSMS;