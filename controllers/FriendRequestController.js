const FriendRequest = require("../models/FriendRequest")

class FriendRequestController {
    static async sendRequest (request, response) {
        try {
            const { receiverId } = request.body;
            const friendRequest = new FriendRequest({
                senderId: request.user._id,
                receiverId: receiverId
            })
            await friendRequest.save();
            return response.json({
                status: true,
                message: "Friend request sent successfully",
            });
        } catch (error) {
            return response.json({
                status: false,
                message: error,
            });
        }
    }

    static async acceptRequest (request, response) {
        try {
            const { senderId } = request.body;
            await FriendRequest.findOneAndUpdate({
                senderId: senderId,
                receiverId: request.user._id,
            }, {
                status: "accept",
            })
            return response.json({
                status: true,
                message: "Friend request accepted successfully.",
            });
        } catch (error) {
            return response.json({
                status: false,
                message: error,
            });
        }
    }

    static async declineRequest (request, response) {
        try {
            const {senderId} = request.body;
            await FriendRequest.findOneAndUpdate({
                senderId: senderId,
                receiverId: request.user._id,
            }, {
                status: "decline",
            })
            return response.json({
                status: true,
                message: "Friend request declineed successfully.",
            });
        } catch (error) {
            return response.json({
                status: false,
                message: error,
            });
        }
    }

    static async getFriendRequestList (request, response) {
        try {
            const friendRequest = await FriendRequest.find({
                receiverId: request.user._id,
                status: "pending",
            }).populate('senderId', 'first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit');
            return response.json({
                status: true,
                message: "Friend request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return response.json({
                status: false,
                message: error,
            });
        }
    }
}

module.exports = FriendRequestController;