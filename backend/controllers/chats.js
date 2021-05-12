const asyncHandler = require('../middleware/async-handler')
const Post = require("../model/Post")
const User = require("../model/User")
const Chat = require("../model/Chat")



const ErrorResponse = require('../utils/ErrorResponse')
const Message = require('../model/Message')

// @desc    Handling new chat
// @route   POST /api/chat
// @access  Private
exports.handleChat = asyncHandler(async (req, res, next) => {
    const { users } = req.body

    let chatProfilePic;

    if (users.length === 0) {
        return next(new ErrorResponse("No users to chat", 400))
    }

    users.unshift(req.user.id);

    const chatUsers = await User.find({ _id: { $in: users } }, { name: 1, profilePhoto: 1 }, { new: true })

    let chatName = chatUsers.filter(user => user._id != req.user.id).map(user => user.name).join(', ')
    chatName = chatName.length <= 50 ? chatName : (chatName.substr(0, 47) + '...')

    const isGroupChat = (users.length > 2) ? true : false

    if (isGroupChat)
        chatProfilePic = 'https://figeit.com/images/chat/mck-icon-group.png'
    else
        chatProfilePic = chatUsers.find(user => user._id == req.user.id).profilePhoto.url


    const results = await Chat.create({
        chatName,
        users,
        isGroupChat,
        chatProfilePic
    })

    res.status(200).json(results)
})

// @desc    Gettig user chats
// @route   GET /api/chat
// @access  Private
exports.getChatList = asyncHandler(async (req, res, next) => {

    let results = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
        .populate("users", { name: 1, username: 1, profilePhoto: 1 })
        .populate("latestMessage")
        .sort({ updatedAt: -1 })

    if (req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
        results = results.filter(r => r.latestMessage && !r.latestMessage.readBy.includes(req.user.id));
    }

    results = await User.populate(results, { path: "latestMessage.sender", select: { name: 1, username: 1, profilePhoto: 1 } })

    res.status(200).json(results)
})

// @desc    Get specific chat
// @route   GET /api/chat/:chatId
// @access  Private
exports.getChat = asyncHandler(async (req, res, next) => {

    const results = await Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.user.id } } })
        .populate("users", { name: 1, username: 1, profilePhoto: 1 })

    res.status(200).json(results)

})

// @desc    Get messages of specific chat
// @route   GET /api/chat/:chatId/messages
// @access  Private
exports.getChatMessages = asyncHandler(async (req, res, next) => {

    const results = await Message.find({ chat: req.params.chatId })
        .populate("sender", { name: 1, username: 1, profilePhoto: 1 })

    await Message.updateMany({ chat: req.params.chatId }, { $addToSet: { readBy: req.user.id } })

    const { isGroupChat } = await Chat.findById(req.params.chatId, { isGroupChat: 1 })

    res.status(200).json({ results, isGroupChat })

})

// @desc    Updating chat name
// @route   PUT /api/chat/:chatId
// @access  Private
exports.updateChat = asyncHandler(async (req, res, next) => {
    const { chatName = '' } = req.body

    if (!chatName)
        return next(new ErrorResponse('No Chatname to update', 400))

    const results = await Chat.findByIdAndUpdate({ _id: req.params.chatId }, { chatName }, { new: true })

    res.status(200).json(results)
})

// @desc    Marking chat as read
// @route   PUT /api/chat/:chatId/messages/markasread
// @access  Private
exports.markChatAsRead = asyncHandler(async (req, res, next) => {
    await Message.updateOne({ chat: req.params.chatId }, { $addToSet: { readBy: req.user.id } })
    res.status(200)
})