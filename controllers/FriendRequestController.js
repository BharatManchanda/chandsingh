const FriendRequest = require("../models/FriendRequest")

class FriendRequestController {
    static async sendRequest (request, response) {
        try {
            const FriendRequest = new FriendRequest({
                senderId: request.user._id,
                receiverId: request.receiverId
            })
            await FriendRequest.save();
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
            await FriendRequest.findOneAndUpdate({
                senderId: request.user._id,
            })
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

    static async declineRequest (request, response) {

    }
}

module.exports = FriendRequestController;