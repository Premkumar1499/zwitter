const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const ErrorResponse = require('./ErrorResponse.js')
const User = require('../model/User.js')

const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (user, subject, html, res, next) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'zwitter.ar14@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            },
        });

        const mailOptions = {
            from: 'Zwitter <zwitter.ar14@gmail.com>',
            to: user.email,
            subject,
            html,
        };

        res.status(200).json({
            success: true,
            id: user._id,
            email: true
        });

        await transport.sendMail(mailOptions);

        console.log(`Message sent successfully to ${user.email}`);

    } catch (err) {
        console.log(err)
        // await User.deleteOne({ email: user.email })
        return next(new ErrorResponse('email could not be sent', 500));
    }
}


module.exports = sendMail