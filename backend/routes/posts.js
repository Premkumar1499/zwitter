const express = require("express");
const { handlePost, getPosts, likePost, retweetPost, getSinglePost, getPostDetails, deletePost, pinPost, bookmarkPost, hashtagPosts } = require("../controllers/posts");
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

// router.route("/:id").get(protect, getSinglePost).delete(protect, deletePost)
router.route("/:id").get(protect, getSinglePost).delete(protect, deletePost).put(protect, pinPost)
router.route("/:id/detail").get(protect, getPostDetails)
router.route("/:id/like").put(protect, likePost)
router.route("/:id/retweet").post(protect, retweetPost)
router.route("/:id/bookmark").put(protect, bookmarkPost)
router.route("/hashtag/:name").get(protect, hashtagPosts)




router.route("/").get(protect, getPosts).post(protect, handlePost)

module.exports = router

