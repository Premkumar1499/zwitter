const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const router = express.Router()

const { getBusinessNews, getScienceNews, getSportsNews, getHealthNews } = require("../controllers/explore")

router.route("/business").get(getBusinessNews)
router.route("/science").get(getScienceNews)
router.route("/sports").get(getSportsNews)
router.route("/health").get(getHealthNews)



module.exports = router