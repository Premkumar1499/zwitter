const asyncHandler = require('../middleware/async-handler')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail.js')
const sendSms = require('../utils/sendSms.js')
const { registerEmailHtml, registerSmsText, passwordEmailHtml, passwordSmsText } = require('../utils/otpHtml')

const User = require('../model/User.js')
const Notification = require("../model/Notification")
const ErrorResponse = require('../utils/ErrorResponse.js')
const resUser = require('../utils/userResponse')


// @desc    user registration using phone or email and sending token
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email = '', phone = {}, dob, username } = req.body

    const isPhone = !(Object.keys(phone).length === 0 && phone.constructor === Object)

    let user;

    if (!email && !isPhone)
        return next(new ErrorResponse('Enter email or phone', 400))

    user = await User.findOne({ username })
    if (user)
        return next(new ErrorResponse('Username already exist. Try another username', 400))


    if (email)
        user = await User.findOne({ email })
    else if (isPhone)
        user = await User.findOne({ phone: phone.phoneNo })

    if (user && user.active) {
        return next(new ErrorResponse(`You are already registered with ${email || phone}`, 400))
    }

    if (email) {
        if (user && !user.active) {
            user.name = name
            user.dob = dob
            user.username = username
            sendTokenToEmail(user, res, next)
        } else {
            const newUser = await User.create({
                name,
                email,
                dob,
                username
            })
            sendTokenToEmail(newUser, res, next)
        }
    }


    if (isPhone) {
        if (user && !user.active) {
            user.name = name
            user.dob = dob
            user.intl = phone.intl
            user.username = username
            sendTokenToPhone(user, res, next)
        } else {
            const newUser = await User.create({
                name,
                phone: phone.phoneNo,
                intl: phone.intl,
                dob,
                username
            })
            sendTokenToPhone(newUser, res, next)
        }
    }

})

// @desc    verifying the register token
// @route   POST /api/auth/register-verify
// @access  Public
exports.registerVerification = asyncHandler(async (req, res, next) => {
    const { email = "", phone = " ", otp } = req.body;


    if (!email && !phone)
        return next(new ErrorResponse('Invalid credentials', 400))


    const registerToken = otp

    const user = await User.findOne({
        $or: [{ email }, { phone }],
        registerToken,
        registerTokenExpire: { $gt: Date.now() }
    });


    if (!user) {
        return next(new ErrorResponse("You havn't registered", 401));
    }

    user.active = true
    user.registerToken = undefined;
    user.registerTokenExpire = undefined;
    await user.save();


    res.json({
        id: user.id,
    })
})

// @desc    Resending register token
// @route   POST /api/auth/resend-register-token
// @access  Public
exports.resendRegisterToken = asyncHandler(async (req, res, next) => {
    const { email = "", phone = "" } = req.body

    if (!email && !phone)
        return next(new ErrorResponse('Invalid credentials', 400))

    const user = await User.findOne({ $or: [{ email }, { phone }] })

    if (user && user.active) {
        return next(new ErrorResponse('You are already registered with this email', 400));
    }

    if (!user) {
        return next(new ErrorResponse('Invalid credential', 400))
    }

    email ? sendTokenToEmail(user, res, next) : sendTokenToPhone(user, user.intl, res, next)
})

// @desc    Update password after token verification
// @route   POST /api/auth/setpassword
// @access  Public
exports.setPassword = asyncHandler(async (req, res, next) => {
    const { id, password } = req.body


    if (!password || !id)
        return next(new ErrorResponse('Invalid credential', 400))

    const user = await User.findById({ _id: id }).select('+tokens')
    if (!user) {
        return next(new ErrorResponse('Invalid credential', 400))
    }

    user.password = password

    const token = user.getSignedJwtToken()
    user.tokens.push(token)
    await user.save()

    res.status(200).json({
        token,
        user: resUser(user)
    })
})

// @desc    Update password after token verification
// @route   POST /api/auth/setpassword
// @access  Public
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { id, currentPassword = "", newPassword = "" } = req.body

    if (!currentPassword || !id || !newPassword)
        return next(new ErrorResponse('Invalid credential', 400))

    const user = await User.findById(id).select(['+password', '+tokens'])
    if (!user) {
        return next(new ErrorResponse('Invalid credential', 400))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
        return next(new ErrorResponse('Password not matching', 401));
    }

    user.password = newPassword

    const token = user.getSignedJwtToken()
    user.tokens = []
    user.tokens.push(token)
    await user.save()

    res.status(200).json({
        token,
        user: resUser(user)
    })
})



// @desc    User login
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { account, password, info } = req.body

    console.log(account)

    if (!account || !password)
        return next(new ErrorResponse('Enter all details', 400))

    const user = await User.findOne({ $or: [{ username: account }, { email: account }, { phone: account }] }).select(['+password', '+tokens'])

    if (!user) {
        return next(new ErrorResponse('Details you entered did not match our records.', 401));
    }

    if (!user.active) {
        return next(new ErrorResponse('Account not activated', 401))
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Password not matching', 401));
    }

    const token = user.getSignedJwtToken()
    user.tokens.push(token)

    await user.save()

    await Notification.insertNotification(user._id, user._id, "new login", user._id, info);

    res.status(200).json({
        token,
        user: resUser(user)
    })
})

// @desc    Forgot password token
// @route   POST /api/auth/password-token
// @access  Public
exports.sendpasswordToken = asyncHandler(async (req, res, next) => {
    const { account } = req.body
    if (!account)
        return next(new ErrorResponse("Invalid credentials", 400))

    const user = await User.findOne({ $or: [{ username: account }, { email: account }, { phone: account }] })

    if (!user) {
        return next(new ErrorResponse('Details you entered did not match our record.', 401));
    }

    if (!user.active) {
        return next(new ErrorResponse('Account not activated', 401))
    }

    if (user.email)
        sendTokenToEmail(user, res, next)
    else if (user.phone)
        sendTokenToPhone(user, user.intl, res, next)
})

// @desc    Forgot password token verification 
// @route   POST /api/auth/password-token-verify
// @access  Public
exports.passwordTokenVerification = asyncHandler(async (req, res, next) => {
    const { id, code } = req.body;

    if (!id && !code)
        return next(new ErrorResponse('Invalid credentials', 400))

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(code)
        .digest('hex');

    const user = await User.findOne({
        _id: id,
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid token', 401));
    }


    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();


    res.status(200).json({
        succes: true,
        id: user.id,
        name: user.name,
        username: user.username,
        profilePhoto: user.profilePhoto
    })
})

exports.logout = asyncHandler(async (req, res) => {
    const { token = '' } = req.body

    if (!token)
        return next(new ErrorResponse('Invalid token', 400))

    await User.updateOne({ _id: req.user.id }, { $pull: { tokens: token } })

    res.status(200).json('hii')

})


async function sendTokenToEmail(user, res, next) {
    let token, html, subject;

    if (user.active) {
        token = user.getResetPasswordToken()
        html = passwordEmailHtml(token, user.username)
        subject = 'Password reset request'
    }
    else {
        token = user.getRegisterToken()
        html = registerEmailHtml(token)
        subject = `${token} is your Zwitter verification code`
    }
    await user.save({ validateBeforeSave: false });


    sendMail(user, subject, html, res, next);
}

async function sendTokenToPhone(user, res, next) {

    let token, text;

    if (user.active) {
        token = user.getResetPasswordToken()
        text = passwordSmsText(token, user.username)
    }
    else {
        token = user.getRegisterToken()
        text = registerSmsText(token)
    }


    await user.save({ validateBeforeSave: false });

    sendSms(user, text, res, next);

}