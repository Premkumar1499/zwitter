const accountSid = 'AC8956df18db41a9331761fa35fe8140db';
const authToken = '6cc3daef2a80eca2aee4a62410908303';
const client = require('twilio')(accountSid, authToken);
const ErrorResponse = require('../utils/ErrorResponse.js')
const User = require('../model/User.js')




const sendSms = async (user, text, res, next) => {
    try {



        const message = await client.messages
            .create({
                body: text,
                from: '+19286429918',
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