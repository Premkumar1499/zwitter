const asyncHandler = require('../middleware/async-handler')

const Notification = require('../model/Notification')

// @desc    Get notifications initially when the app starts
// @route   GET /api/notication
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
    var searchObj = { userTo: req.user.id, notificationType: { $ne: "newMessage" } };

    if (req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
        searchObj.opened = false;
    }

    let results = await Notification.find(searchObj)
        .populate("userTo", { profilePhoto: 1, name: 1, username: 1 })
        .populate("userFrom", { profilePhoto: 1, name: 1, username: 1 })
        .sort({ createdAt: -1 })

    if (req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
        results = results.filter(r => r.userFrom._id.toString() != r.userTo._id.toString())
    }

    res.status(200).json(results)
})

// @desc    Mark specific notification as opened
// @route   POST /api/notication/:id/markasopened
// @access  Private
exports.markAsOpened = asyncHandler(async (req, res, next) => {
    await Notification.findByIdAndUpdate(req.params.id, { opened: true })
    res.sendStatus(204)
})

// @desc    Mark all notifications as opened
// @route   POST /api/notication/markasopened
// @access  Private
exports.markAsOpenedAll = asyncHandler(async (req, res, next) => {
    await Notification.updateMany({ userTo: req.user.id }, { opened: true })
    res.sendStatus(204)

})

exports.getLatest = asyncHandler(async (req, res, next) => {

    const results = await Notification.findOne({ userTo: req.user.id })
        .populate("userTo")
        .populate("userFrom")
        .sort({ createdAt: -1 })

    res.status(200).send(results)


})