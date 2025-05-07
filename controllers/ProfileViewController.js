const ProfileView = require("../models/ProfileView");

class ProfileViewController {
    static async viewMark(req, res) {
        try {
            const profileView = await ProfileView.create({
                userId: req.body.userId,
                viewerId: req.user._id,
            });
            
            return res.json({
                "status": true,
                "message": "Profile mark as view.",
                "data": {
                    profileView
                },
            });
        } catch (error) {
            return res(422).json({
                "status": false,
                "message": error.message
            });
        }
    }
    static async viewdProfile (req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const skip = (page-1) * limit;

            const totalCount = await ProfileView.countDocuments({
                userId: req.user._id,
            });

            const totalPages = Math.ceil(totalCount / limit);

            const profileView = await ProfileView.find({
                userId: req.user._id,
            }).populate('viewerId', "first_name last_name role gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself daily_view_limit")
            .sort({createdAt: -1})
            .limit(limit)
            .skip(skip);

            return res.json({
                "status": true,
                "message": "Profile fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    profileView
                },
            });
        } catch (error) {
            return res.json(422).json({
                "status": false,
                "message": error.message
            })
        }
    }
}

module.exports = ProfileViewController