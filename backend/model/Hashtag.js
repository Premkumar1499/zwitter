const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema({
    name: { type: String },
    tweets: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }]
}, { timestamps: true });

const Hashtag = mongoose.model('Hashtag', HashtagSchema)
module.exports = Hashtag;