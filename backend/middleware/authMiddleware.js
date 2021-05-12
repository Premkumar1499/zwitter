const jwt = require('jsonwebtoken')
const asyncHandler = require('./async-handler')
const User = require('../model/User.js')
const ErrorResponse = require('../utils/ErrorResponse.js')


exports.protect = asyncHandler(async (req, res, next) => {
    let token

    if (
        req.headers.authorization?.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('+tokens')

            if (req.user.tokens.includes(token) && req.user)
                next()
            else
                next(new ErrorResponse('Not authorized', 401))

        } catch (error) {
            next(new ErrorResponse('Not authorized', 401))
        }
    }
})
