const express = require("express");
const { protect } = require("../middleware/authMiddleware")
const { handleChat, getChatList, getChat, updateChat, getChatMessages, markChatAsRead } = require("../controllers/chats")

const router = express.Router();

router.route('/').get(protect, getChatList).post(protect, handleChat)
router.route('/:chatId').get(protect, getChat).put(protect, updateChat)
router.route('/:chatId/messages').get(protect, getChatMessages)
router.route('/:chatId/messages/markasread').put(protect, markChatAsRead)




module.exports = router