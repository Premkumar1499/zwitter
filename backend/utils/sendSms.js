const accountSid = process.env.TWILIO_ID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);
const ErrorResponse = require('../utils/ErrorResponse.js')
const User = require('../model/User.js')




const sendSms = async (user, text, res, next) => {
    try {



        const message = await client.messages
            .create({
                body: text,
                from: process.env.TWILIO_CALL_NUMBER,
                to: `+${user.intl}${user.phone}`
            })

        console.log(message)
        res.status(200).json({
            success: true,
            id: user._id,
            phone: true
        });


    } catch (err) {
        console.log(err)
        await User.deleteOne({ phone: user.phone })
        return next(new ErrorResponse('Please use email. Sorry for the inconvinence', 500));

    }
}

module.exports = sendSms

    // .then(message => console.log(message.sid))
    // .catch(err => console.log(err));