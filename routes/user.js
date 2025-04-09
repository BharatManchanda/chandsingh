const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();
const auth = require("../middleware/Auth");

router.use(auth);

router.post('/new-user', UserController.newUser);
router.post('/daily-user', UserController.dailyUser);
router.post('/matches-user', UserController.matchesUser);
router.post('/near-me', UserController.nearMe);
router.post('/recently-join', UserController.recentlyJoin);
router.post('/decrease-limit', UserController.decreaseLimit);

module.exports = router;