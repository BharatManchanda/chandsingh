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
                message: error.message,
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
                message: error.message,
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
                message: error.message,
            });
        }
    }

    static async getFriendRequestList (req, res) {
        try {

            // const friendRequest = await FriendRequest.aggregate([
            //     {
            //         $match: {receiverId: req.user._id, status: "pending"}
            //     },
            //     {
            //         $lookup: {
            //             from: "users", // assuming "users" is the collection name for sender data
            //             localField: "senderId", // this field is the senderId in FriendRequest
            //             foreignField: "_id", // _id in the "users" collection
            //             as: "sender" // we will create a new field 'sender'
            //         }
            //     },
            //     { $unwind: "$sender"},
            //     {
            //         $project: {
            //             _id: 1,
            //             receiverId: 1,
            //             status: 1,
            //             sender: {
            //                 first_name: 1,
            //                 last_name: 1,
            //                 email: 1,
            //                 phone: 1,
            //                 role: 1,
            //                 gender: 1,
            //                 dob: 1,
            //                 religion: 1,
            //                 community: 1,
            //                 live: 1,
            //                 live_with_your_family: 1,
            //                 marital_status: 1,
            //                 diet: 1,
            //                 height: 1,
            //                 highest_qualification: 1,
            //                 college_name: 1,
            //                 work_with: 1,
            //                 income: 1,
            //                 about_yourself: 1,
            //                 daily_view_limit: 1,
            //             }
            //         }
            //     }
            // ]);

            const friendRequest = await FriendRequest.find({
                receiverId: req.user._id,
                status: "pending",
            }).populate({
                path: 'senderId',
                select:'first_name last_name role gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit',
                populate: {
                    path: 'files', // virtual field
                    model: 'File', // explicitly mention the model
                }
            });
            return res.json({
                status: true,
                message: "Friend request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error.message,
            });
        }
    }

    static async getFriendRequestSend() {
        try {
            const friendRequest = await FriendRequest.find({
                senderId: req.user._id,
                status: "pending",
            }).populate({
                path: 'senderId',
                select: 'first_name last_name role gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit',
                populate: {
                    path: 'files', // virtual field
                    model: 'File', // explicitly mention the model
                }
            });
            return res.json({
                status: true,
                message: "Friend Request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error.message,
            });
        }
    }

    static async getFriendRequestDeclined (req, res) {
        try {
            const friendRequest = await FriendRequest.find({
                receiverId: req.user._id,
                status : "decline",
            }).populate({
                path: 'senderId',
                select: 'first_name last_name role gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit',
                populate: {
                    path: 'files', // virtual field
                    model: 'File', // explicitly mention the model
                }
            });
            return res.json({
                status: true,
                message: "Friend request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error.message,
            });
        }
    }

    static async getFriendRequestAccepted (req, res) {
        try {
            const friendRequest = await FriendRequest.find({
                receiverId: req.user._id,
                status : "accept",
            }).populate({
                path: 'senderId',
                select: 'first_name last_name role gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit',
                populate: {
                    path: 'files', // virtual field
                    model: 'File', // explicitly mention the model
                }
            });
            return res.json({
                status: true,
                message: "Friend request fetched successfully.",
                data: friendRequest,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: error.message,
            });
        }
    }
}

module.exports = FriendRequestController;