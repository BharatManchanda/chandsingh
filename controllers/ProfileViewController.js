const ProfileView = require("../models/ProfileView");

class ProfileViewController {
    static async viewMark(request, response) {
        try {
            const profileView = await ProfileView.create({
                userId: request.body.userId,
                viewerId: request.user._id,
            });
            return response.json({
                "status": true,
                "message": "Profile mark as view.",
                "data": {
                    profileView
                },
            });
        } catch (error) {
            return response.status(422).json({
                "status": false,
                "message": error
            });
        }
    }
    static async viewdProfile (request, response) {
        try {
            const limit = parseInt(request.query.limit) || 10;
            const page = parseInt(request.query.page) || 1;

            const skip = (page-1) * limit;

            const totalCount = await ProfileView.countDocuments({
                user_id: request.user._id,
            });

            const totalPages = Math.ceil(totalCount / limit);

            const profileView = await ProfileView.find({
                user_id: request.user._id,
            }).populate('viewerId', "first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit")
            .sort({createdAt: -1})
            .limit(limit)
            .skip(skip);

            return response.json({
                "status": true,
                "message": "Profile fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    profileView
                },
            });
        } catch (error) {
            return response.status(422).json({
                "status": false,
                "message": error
            })
        }
    }
}

module.exports = ProfileViewController