const asyncHandler = require('../middleware/async-handler')
const User = require("../model/User")
const Chat = require("../model/Chat")
const Message = require("../model/Message")


const ErrorResponse = require('../utils/ErrorResponse')
const Notification = require('../model/Notification')

// @desc    Inserting messages
// @route   POST /api/message
// @access  Private
exports.handleMessage = asyncHandler(async (req, res, next) => {
    const { content = '', chatId = '' } = req.body

    if (!content || !chatId)
        return next(new ErrorResponse('No chat data', 400))

    let message = await Message.create({
        sender: req.user.id,
        content,
        chat: chatId,
        readBy: [req.user.id]
    })

    message = await message.populate('sender', { profilePhoto: 1, name: 1, username: 1 }).execPopulate()
    message = await message.populate('chat').execPopulate()
    message = await User.populate(message, { path: 'chat.users', select: { profilePhoto: 1, name: 1, username: 1 } })


    const chat = await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id }, { new: true })

    chat.users.forEach(async userId => {
        if (userId == message.sender._id.toString()) return;

        Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id);
    })

    res.status(200).json(message)
})