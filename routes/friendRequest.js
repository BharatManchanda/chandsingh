const FriendRequestController = require("../controllers/FriendRequestController");
const express = require("express");
const router = express.Router();
const { friendRequestSendValidator, friendRequestAcceptValidator, friendRequestDeclineValidator } = require("../validators/frientRequestValidator");
const { Validate } = require("../middleware/Validate");

router.post('/friend-req/send', friendRequestSendValidator, Validate, FriendRequestController.sendRequest);
router.post('/friend-req/accept', friendRequestAcceptValidator, Validate, FriendRequestController.acceptRequest);
router.post('/friend-req/decline', friendRequestDeclineValidator, Validate, FriendRequestController.declineRequest);
router.post('/friend-req/get', FriendRequestController.getFriendRequestList);
router.post('/friend-req/declined-get', FriendRequestController.getFriendRequestDeclined);
router.post('/friend-req/accepted-get', FriendRequestController.getFriendRequestAccepted);

module.exports = router;