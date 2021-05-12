const Post = require("../model/Post")
const User = require("../model/User")



const getFilteredPosts = async (filter) => {
    var posts = await Post.find(filter)
        .populate("postedBy")
        .populate("retweetData")
        .populate("replyTo")
        .sort({ "createdAt": -1 })

    posts = await User.populate(posts, { path: "replyTo.postedBy" })

    return await User.populate(posts, { path: "retweetData.postedBy" })
}

module.exports = getFilteredPosts