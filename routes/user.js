const express = require("express");
const UserController = require("../controllers/UserController");
const { Validate } = require("../middleware/Validate");
const { userPlanSetValidator } = require("../validators/userValidator");
const router = express.Router();

router.post('/new-user', UserController.newUser);
router.post('/daily-user', UserController.dailyUser);
router.post('/matches-user', UserController.matchesUser);
router.post('/near-me', UserController.nearMe);
router.post('/recently-join', UserController.recentlyJoin);
router.post('/decrease-limit', UserController.decreaseLimit);
router.post('/set-user/plan', userPlanSetValidator, Validate, UserController.setUserPlan);
router.post('/contact-view-request', UserController.viewContact);
router.post('/user-detail/:userId', userDetailValidator, Validate, UserController.detail);

module.exports = router;