const router = require("express").Router()
const controller = require("../controllers/reviewController")

router.post("/add", controller.postReview)
router.post("/delete", controller.removeReview)

module.exports = router
