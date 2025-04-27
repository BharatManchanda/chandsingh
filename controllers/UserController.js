const User = require("../models/User")
const jwt = require("jsonwebtoken");

class UserController {
    static async newUser (req, res) {
        try {
            const user = await UserController.getMe(req);
            const gender = user.gender == "male" ? "female" : "male";

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const totalCount = await User.countDocuments({
                gender,
                role: "client"
            });

            const totalPages = Math.ceil(totalCount / limit);

            const skip = (page-1) * limit;
            const newUsers = await User.find({
                gender,
                role: "client"
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself ")
            .sort({createdAt: -1}).limit(limit).skip(skip);

            
            return res.json({
                "status": true,
                "message": "New user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    newUsers,
                },
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error
            })
        }
    }

    static async dailyUser (req, res) {
        try {
            const user = await UserController.getMe(req);
            if (user.daily_view_limit > 0) {
                const gender = user.gender == "male" ? "female" : "male";
                
                const [randomUser] = await User.aggregate([
                    { $match: { role: 'client', gender: gender}},
                    { $sample:{ size: 1}},
                    { $project: {
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        role: 1,
                        phone: 1,
                        gender: 1,
                        dob: 1,
                        religion: 1,
                        community: 1,
                        live: 1,
                        live_with_your_family: 1,
                        marital_status: 1,
                        diet: 1,
                        height: 1,
                        highest_qualification: 1,
                        college_name: 1,
                        work_with: 1,
                        income: 1,
                        about_yourself: 1,
                    }}
                ])
                return res.json({
                    "status": true,
                    "message": randomUser ? "Fetched user successfully." : "Fetch user limit exceed.",
                    "data": randomUser
                })
            } else {
                return res.json({
                    status: false,
                    message: "Daily view limit exceeded.",
                    data: null
                });
            }
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error
            })
        }
    }

    static async matchesUser (req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const skip = (page-1) * limit;
            const user = await UserController.getMe(req);
            const gender = user.gender === "male" ? "female" : "male";

            const totalCount = await User.countDocuments({
                gender,
                role: "client"
            });
            const totalPages = Math.ceil(totalCount / limit);
            
            const matchesUser = await User.find({
                gender,
                role: "client"
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself")
            .sort({createdAt: -1})
            .limit(limit)
            .skip(skip);
            
            return res.json({
                "status": true,
                "message": "Matches user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    matchesUser,
                },
            });
        } catch (error) {
            return res(422).json({
                "status": false,
                "message": error
            })
        }
    }

    static async getMe (req) {
        const decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        const user = await User.findOne({_id: decoded._id});
        return user;
    }

    static async decreaseLimit (req, res){
        const decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        const user = await User.findByIdAndUpdate(decoded._id, {
            $inc:{daily_view_limit: -1},
        });
    }

    static async nearMe (req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const skip = (page-1) * limit;

            const user = await UserController.getMe(req);
            const gender = user.gender === "male" ? "female" : "male";

            const totalCount = await User.countDocuments({
                gender,
                role: "client"
            });
            const totalPages = Math.ceil(totalCount / limit);

            const nearMe = await User.find({
                gender,
                role: "client"
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself")
            .sort({createdAt: -1})
            .limit(limit)
            .skip(skip);
            
            return res.json({
                "status": true,
                "message": "Near me user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    nearMe,
                },
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error
            })
        }
    }
    static async recentlyJoin(req, res) {
        try {            
            const user = await UserController.getMe(req);
            const gender = user.gender == "male" ? "female" : "male";

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const totalCount = await User.countDocuments({
                gender,
                role: "client"
            });

            const totalPages = Math.ceil(totalCount / limit);
            const skip = (page-1) * limit;

            const data = await User.find({
                gender,
                role: "client"
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself ")
            .sort({createdAt: -1}).limit(limit).skip(skip);
            
            return res.json({
                "status": true,
                "message": "Recently user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    data,
                },
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error
            })
        }
    }
    
    static async viewContact(req, resp) {
        const user = req.user;
        user.plan
    }
}


module.exports = UserController;