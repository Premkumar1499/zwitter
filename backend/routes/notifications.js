const express = require("express")
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const { getNotifications, markAsOpened, markAsOpenedAll, getLatest } = require('../controllers/notifications')

router.route('/').get(protect, getNotifications)
router.route('/:id/markasopened').put(protect, markAsOpened)
router.route('/markasopened').put(protect, markAsOpenedAll)
router.route('/latest').get(protect, getLatest)

module.exports = router