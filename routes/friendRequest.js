const FriendRequestController = require("../controllers/FriendRequestController");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");

router.use(auth);

router.post('/friend-request/send', FriendRequestController.sendRequest);
router.post('/friend-request/accept', FriendRequestController.acceptRequest);
router.post('/friend-request/decline', FriendRequestController.declineRequest);
router.post('/friend-request/get', FriendRequestController.getFriendRequestList);

module.exports = router;