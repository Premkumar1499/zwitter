const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    chatProfilePic: { type: String },
    latestMessage: { type: mongoose.Schema.ObjectId, ref: 'Message' }
}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;

