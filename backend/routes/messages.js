const express = require("express");
const { protect } = require("../middleware/authMiddleware")
const { handleMessage } = require("../controllers/messages")

const router = express.Router();

router.route('/').post(protect, handleMessage)


module.exports = router