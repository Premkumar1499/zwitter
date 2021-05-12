const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    post: { type: Object, trim: true },
    postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    pinned: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    retweetUsers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    retweetData: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    replyTo: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    repliedUsers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],

}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;