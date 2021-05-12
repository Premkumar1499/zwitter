const asyncHandler = require('../middleware/async-handler')
const Post = require("../model/Post")
const User = require("../model/User")
const Notification = require("../model/Notification")


const ErrorResponse = require('../utils/ErrorResponse')
const cloudinary = require('../utils/cloudinary')
const removeTmp = require('../utils/removeTmp')
const getFilteredPosts = require('../utils/getFilteredPosts')
const Hashtag = require('../model/Hashtag')


// @desc    Get posts of following users and ourself
// @route   GET /api/post
// @access  Private
exports.getPosts = asyncHandler(async (req, res, next) => {
    let posts = await getFilteredPosts({ postedBy: { $in: [...req.user.following, req.user.id] } })
    res.status(200).json(posts)
})

// @desc   Delete post
// @route   DELETE /api/post/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const result = await Post.findByIdAndDelete(req.params.id)
    res.status(200).json(result._id)
})

// @desc   Insert post
// @route   POST /api/post
// @access  Private
exports.handlePost = asyncHandler(async (req, res, next) => {
    const { text = '', replyTo = '', gif } = req.body
    const userId = req.user._id;

    let public_id = '', url = ''
    let GIF = JSON.parse(gif)

    if (req.files === null && !text && !GIF?.url) {
        return next(new ErrorResponse('No post content', 400))
    }

    if (req.files?.image) {
        ({ public_id, url } = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, { folder: 'zwitter_posts' }))
        url = url.split('upload').join('upload/w_500/f_auto')
        removeTmp(req.files.image.tempFilePath)
        // const result = await cloudinary.v2.uploader.destroy('uskaai2numyu5icnimqa')
    }

    if (GIF?.url && GIF?.id) {
        public_id = GIF.id
        url = GIF.url
    }

    let postData = {
        post: {
            text,
            postImg: {
                id: public_id,
                url: url
            }
        },
        postedBy: req.user.id
    }

    if (replyTo) {
        postData.replyTo = replyTo
        await Post.findByIdAndUpdate(replyTo, { $addToSet: { repliedUsers: req.user.id } })
    }


    let newPost = await Post.create(postData)
    newPost = await User.populate(newPost, { path: "postedBy" })

    if (newPost.replyTo !== undefined) {
        newPost = await Post.populate(newPost, { path: "replyTo" })
        newPost = await User.populate(newPost, { path: "replyTo.postedBy" })

        await Notification.insertNotification(newPost.replyTo.postedBy._id, req.user.id, "reply", newPost._id);
    }

    const re = /#[0-9a-z]\w*\b/gi
    const string = newPost.post.text
    string.match(re)?.forEach(async s => {
        const d = await Hashtag.updateOne({ name: s }, { $addToSet: { tweets: newPost._id } }, { upsert: true })
        console.log(s, d)

    })

    res.status(200).json(newPost)

})

// @desc   Like or unlike post
// @route   POST /api/post/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const isLiked = req.user.likes?.includes(postId);

    const options = isLiked ? "$pull" : "$addToSet";

    await User.findByIdAndUpdate(userId, { [options]: { likes: postId } })

    const post = await Post.findByIdAndUpdate(postId, { [options]: { likes: userId } }, { new: true })

    if (!isLiked && post.postedBy.toString() !== userId.toString()) {
        await Notification.insertNotification(post.postedBy, userId, "postLike", post._id);
    }

    res.status(200).send(post)
})

// @desc   Retweet or unretweet post
// @route   POST /api/post/:id/retweet
// @access  Private
exports.retweetPost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId })

    const option = deletedPost != null ? "$pull" : "$addToSet";

    var repost = deletedPost;

    if (repost == null) {
        repost = await Post.create({ postedBy: userId, retweetData: postId })
    }

    await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id } }, { new: true })

    const post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId } }, { new: true })

    if (!deletedPost && post.postedBy.toString() !== userId.toString()) {
        await Notification.insertNotification(post.postedBy, userId, "retweet", post._id);
    }


    res.status(200).send(post)

})

// @desc   Pin and unpin post
// @route   PUT /api/post/:id
// @access  Private
exports.pinPost = asyncHandler(async (req, res, next) => {
    if (req.body.pinned !== undefined) {
        await Post.updateMany({ postedBy: req.user.id }, { pinned: false })
    }

    await Post.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json('success')
})

// @desc   Bookmark and unbookmark post
// @route   PUT /api/post/:id
// @access  Private
exports.bookmarkPost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    const userId = req.user._id;

    const isBookmarked = req.user.bookmarks?.includes(postId);

    const options = isBookmarked ? "$pull" : "$addToSet";

    await User.findByIdAndUpdate(userId, { [options]: { bookmarks: postId } })
    res.status(200).json(!isBookmarked)
})

// @desc   Get post
// @route   GET /api/post/:id
// @access  Private
exports.getSinglePost = asyncHandler(async (req, res, next) => {
    const postId = req.params.id
    let post = await getFilteredPosts({ _id: postId })
    post = post[0]
    res.status(200).json(post)
})

// @desc   Get post details
// @route   GET /api/post/:id/detail
// @access  Private
exports.getPostDetails = asyncHandler(async (req, res, next) => {
    let postId = req.params.id;

    let postData = await getFilteredPosts({ _id: postId });
    postData = postData[0];

    let results = {
        postData: postData
    }

    if (postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getFilteredPosts({ replyTo: postId });

    res.status(200).send(results);
})

exports.hashtagPosts = asyncHandler(async (req, res, next) => {
    let hashtag = req.params.name

    const postsId = await Hashtag.find({ name: `#${hashtag}` }, { tweets: 1 }, { new: true })
    const posts = await getFilteredPosts({ _id: { $in: postsId[0].tweets } })

    res.status(200).json(posts)
})


