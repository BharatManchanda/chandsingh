const FriendRequest = require("../models/FriendRequest")

class FriendRequestController {
    static async sendRequest (req, res) {
        try {
            const { receiverId } = req.body;
            const friendRequest = new FriendRequest({
                senderId: req.user._id,
                receiverId: receiverId
            })
            await friendRequest.save();
            return res.json({
                status: true,
                message: "Friend request sent successfully",
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error,
            });
        }
    }

    static async acceptRequest (req, res) {
        try {
            const { senderId } = req.body;
            await FriendRequest.findOneAndUpdate({
                senderId: senderId,
                receiverId: req.user._id,
            }, {
                status: "accept",
            })
            return res.json({
                status: true,
                message: "Friend request accepted successfully.",
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error,
            });
        }
    }

    static async declineRequest (req, res) {
        try {
            const {senderId} = req.body;
            await FriendRequest.findOneAndUpdate({
                senderId: senderId,
                receiverId: req.user._id,
            }, {
                status: "decline",
            })
            return res.json({
                status: true,
                message: "Friend request declineed successfully.",
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error,
            });
        }
    }

    static async getFriendRequestList (req, res) {
        try {
            const friendRequest = await FriendRequest.find({
                receiverId: req.user._id,
                status: "pending",
            }).populate('senderId', 'first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit');
            return res.json({
                status: true,
                message: "Friend request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error,
            });
        }
    }

    static async getFriendRequestDeclined (req, res) {
        try {
            const friendRequest = await FriendRequest.find({
                receiverId: req.user._id,
                status : "decline",
            });
            return res.json({
                status: true,
                message: "Friend request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error,
            });
        }
    }

    static async getFriendRequestAccepted (req, res) {
        try {
            const friendRequest = await FriendRequest.find({
                receiverId: req.user._id,
                status : "accept",
            });
            return res.json({
                status: true,
                message: "Friend request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error,
            });
        }
    }
}

module.exports = FriendRequestController;