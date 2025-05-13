const FriendRequestController = require("../controllers/FriendRequestController");
const express = require("express");
const router = express.Router();
const { friendRequestSendValidator, friendRequestAcceptValidator, friendRequestDeclineValidator } = require("../validators/frientRequestValidator");
const { Validate } = require("../middleware/Validate");

router.post('/friend-request/send', friendRequestSendValidator, Validate, FriendRequestController.sendRequest);
router.post('/friend-request/accept', friendRequestAcceptValidator, Validate, FriendRequestController.acceptRequest);
router.post('/friend-request/decline', friendRequestDeclineValidator, Validate, FriendRequestController.declineRequest);

router.post('/friend-request/get', FriendRequestController.getFriendRequestList);
router.post('/friend-request/sent-by-me', FriendRequestController.getFriendRequestSendByMe);
router.post('/friend-request/declined-get', FriendRequestController.getFriendRequestDeclined);
router.post('/friend-request/accepted-get', FriendRequestController.getFriendRequestAccepted);

module.exports = router;