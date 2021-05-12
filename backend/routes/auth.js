const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const router = express.Router()

const { register, registerVerification, resendRegisterToken, setPassword, login, sendpasswordToken, passwordTokenVerification, changePassword, logout } = require('../controllers/auth.js')

router.route('/register').post(register)
router.route('/register-verify').post(registerVerification)
router.route('/resend-register-token').post(resendRegisterToken)
router.route('/setpassword').post(setPassword)

router.route('/login').post(login)
router.route('/password-token').post(sendpasswordToken)
router.route('/password-token-verify').post(passwordTokenVerification)

router.route('/change-password').put(protect, changePassword)
router.route('/logout').post(protect, logout)


module.exports = router