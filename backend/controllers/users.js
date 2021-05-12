const asyncHandler = require('../middleware/async-handler')
const Notification = require("../model/Notification")
const removeTmp = require('../utils/removeTmp')
const User = require('../model/User.js')
const Hashtag = require('../model/Hashtag.js')
const ErrorResponse = require('../utils/ErrorResponse.js')
const resUser = require('../utils/userResponse')
const cloudinary = require('../utils/cloudinary')
const getFilteredPosts = require('../utils/getFilteredPosts')

// @desc    Get user details
// @route   GET /api/user
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = req.user
    res.status(200).json({
        user: resUser(user)
    })
})

// @desc    Get users to connect (except following users and ourself)
// @route   GET /api/user/connect
// @access  Private
exports.getUsersToConect = asyncHandler(async (req, res, next) => {
    let users;
    if (req.query.limit !== undefined) {
        users = await User.find({ _id: { $nin: [...req.user.following, req.user.id] } }, { name: 1, username: 1, profilePhoto: 1, role: 1 }).limit(Number.parseInt(req.query.limit))
    } else {
        users = await User.find({ _id: { $nin: [...req.user.following, req.user.id] } }, { name: 1, username: 1, profilePhoto: 1, role: 1 })
    }

    res.status(200).json(users)
})

// @desc    Search for users
// @route   POST /api/user/search
// @access  Private
exports.searchUser = asyncHandler(async (req, res, next) => {
    const { search = '' } = req.body

    let hashtags = [];
    // console.log(req.query)


    const users = await User.find({
        $or: [
            { name: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
        ],
        username: { $ne: req.user.username }
    }, { name: 1, username: 1, profilePhoto: 1 })

    if (req.query.hashtag !== 'undefined' && req.query.hashtag === 'true') {
        console.log("inside")
        hashtags = await Hashtag.find({ name: { $regex: search, $options: "i" } }, { name: 1 }, { new: true })
        console.log(hashtags)
    }


    res.status(200).json({ users, hashtags })
})



const getUserByUsername = asyncHandler(async (username, next) => {
    const user = await User.findOne({ username })

    if (!user)
        return next(new ErrorResponse('Invalid username', 400))

    return user
})

exports.getUserDetails = asyncHandler(async (req, res, next) => {
    const user = await getUserByUsername(req.params.username, next)

    res.status(200).json({
        user: resUser(user)
    })
})

exports.handleFollow = asyncHandler(async (req, res, next) => {
    const user = await getUserByUsername(req.params.username, next)

    const isFollowing = user.followers?.includes(req.user.id)
    const option = isFollowing ? "$pull" : "$addToSet"

    console.log(isFollowing)

    const result = await User.findByIdAndUpdate(req.user.id, { [option]: { following: user._id } }, { new: true })

    await User.findByIdAndUpdate(user._id, { [option]: { followers: req.user.id } })

    if (!isFollowing) {
        await Notification.insertNotification(user._id, req.user.id, "follow", req.user.id);
    }
    res.status(200).json({ user: resUser(result), isFollowing: !isFollowing })

})

exports.handleEdit = asyncHandler(async (req, res, next) => {
    const username = req.params.username
    const { name, bio = '', location = '', website = '' } = req.body

    const user = await User.findOneAndUpdate({ username }, { name, bio, location, website }, { new: true })

    if (!user)
        return next(new ErrorResponse('Invalid username', 400))

    res.status(200).json({
        user: resUser(user)
    })
})

exports.getTweets = asyncHandler(async (req, res, next) => {
    const user = await getUserByUsername(req.params.username, next)

    const tweets = await getFilteredPosts({ postedBy: user._id, replyTo: { $exists: false }, retweetData: { $exists: false } })

    const pinnedTweet = tweets.find(tweet => tweet.pinned == true)

    res.status(200).json({ tweets, pinnedTweet })
})

exports.getReplies = asyncHandler(async (req, res, next) => {
    const user = await getUserByUsername(req.params.username)

    const tweets = await getFilteredPosts({ postedBy: user._id, replyTo: { $exists: true } })

    res.status(200).json(tweets)
})

exports.getRetweets = asyncHandler(async (req, res, next) => {
    const user = await getUserByUsername(req.params.username, next)

    const retweets = await getFilteredPosts({ _id: { $in: user.retweets } })

    res.status(200).json(retweets)
})

exports.getLikes = asyncHandler(async (req, res, next) => {
    const user = await getUserByUsername(req.params.username, next)

    const likes = await getFilteredPosts({ _id: { $in: user.likes } })

    res.status(200).json(likes)
})

exports.getBookmarks = asyncHandler(async (req, res, next) => {

    const bookmarks = await getFilteredPosts({ _id: { $in: req.user.bookmarks } })

    res.status(200).json(bookmarks)
})


exports.getFollowingAndFollowers = asyncHandler(async (req, res, next) => {
    const user = await getUserByUsername(req.params.username, next)

    const followingId = [...user.following]
    const followersId = [...user.followers]

    const following = await User.find({ _id: { $in: followingId } })
    const followers = await User.find({ _id: { $in: followersId } })

    res.status(200).json({ following, followers })
})


exports.handleCoverPhoto = asyncHandler(async (req, res, next) => {
    const username = req.params.username

    if (req.files === null) {
        return next(new ErrorResponse('No post content', 400))
    }

    let { public_id, url } = await cloudinary.v2.uploader.upload(req.files.coverPhoto.tempFilePath, { folder: 'zwitter_coverPhoto' })

    removeTmp(req.files.coverPhoto.tempFilePath)

    const user = await User.findOneAndUpdate({ username }, { coverPhoto: { public_id, url } }, { new: true })
    res.status(200).json({
        user: resUser(user)
    })
})

exports.handleProfilePhoto = asyncHandler(async (req, res, next) => {
    const username = req.params.username

    if (req.files === null) {
        return next(new ErrorResponse('No post content', 400))
    }

    let { public_id, url } = await cloudinary.v2.uploader.upload(req.files.profilePhoto.tempFilePath, { folder: 'zwitter_profilePhoto' })
    url = url.split('upload').join('upload/w_200/f_auto')


    removeTmp(req.files.profilePhoto.tempFilePath)

    const user = await User.findOneAndUpdate({ username }, { profilePhoto: { public_id, url } }, { new: true })

    res.status(200).json({
        user: resUser(user)
    })
})

