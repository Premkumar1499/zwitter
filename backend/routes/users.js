const express = require("express")
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')

const { getUser, getUsersToConect, searchUser, getUserDetails, handleFollow, handleEdit, getTweets, getReplies, getRetweets, getLikes, getBookmarks, handleCoverPhoto, handleProfilePhoto, getFollowingAndFollowers } = require('../controllers/users.js')

router.route('/').get(protect, getUser)
router.route('/connect').get(protect, getUsersToConect)
router.route('/search').post(protect, searchUser)

/*********** */

router.route('/:username/follow').put(protect, handleFollow)
router.route('/:username/edit').put(protect, handleEdit)

router.route('/:username/tweets').get(protect, getTweets)
router.route('/:username/replies').get(protect, getReplies)
router.route('/:username/retweets').get(protect, getRetweets)
router.route('/:username/likes').get(protect, getLikes)
router.route('/bookmarks').get(protect, getBookmarks)

router.route('/:username').get(protect, getUserDetails)

router.route('/:username/following_followers').get(protect, getFollowingAndFollowers)

router.route('/:username/cover_photo').post(protect, handleCoverPhoto)
router.route('/:username/profile_photo').post(protect, handleProfilePhoto)

module.exports = router