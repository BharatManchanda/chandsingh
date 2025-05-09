const Plan = require("../models/Plan");
const User = require("../models/User")
const jwt = require("jsonwebtoken");
const { maskedPhone, maskedEmail } = require("../utils/maskData");
const FriendRequest = require("../models/FriendRequest");
const { getFriendStatus } = require("../utils/friendUtils");

class UserController {
    static async newUser (req, res) {
        try {
            const gender = req.user.gender == "male" ? "female" : "male";
            const authUserId = req.user._id;

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const {acceptedFriendIds, pendingSentIds} = await getFriendStatus(authUserId);

            const totalCount = await User.countDocuments({
                gender,
                role: "client",
                _id: { $nin: [...acceptedFriendIds, authUserId] }
            });

            const totalPages = Math.ceil(totalCount / limit);

            const skip = (page-1) * limit;
            const newUsers = await User.find({
                gender,
                role: "client"
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself hobbies lastActive")
            .sort({createdAt: -1}).limit(limit).skip(skip).populate('files');
            
            const maskedUsers = newUsers.map(user => {
                return {
                    ...user.toObject(),
                    requestSent: pendingSentIds.includes(String(user._id)),
                    phone: maskedPhone(user.phone),
                    email: maskedEmail(user.email),
                };
            })

            return res.json({
                "status": true,
                "message": "New user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    newUsers:maskedUsers,
                },
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error.message
            })
        }
    }

    static async dailyUser (req, res) {
        try {
            if (req.user.daily_view_limit > 0) {
                const gender = req.user.gender == "male" ? "female" : "male";
                
                const [randomUser] = await User.aggregate([
                    { $match: { role: 'client', gender: gender}},
                    { $sample:{ size: 1}},
                    {
                        $lookup: {
                          from: 'files', // collection name (usually plural and lowercase)
                          localField: 'files',
                          foreignField: '_id',
                          as: 'files'
                        }
                    },
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
                        hobbies: 1,
                        files: 1,
                        lastActive: 1,
                    }}
                ])

                randomUser.phone = maskedPhone(randomUser.phone);
                randomUser.email = maskedEmail(randomUser.email);

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
                "message": error.message
            })
        }
    }

    static async matchesUser (req, res) {
        try {
            const authUserId = req.user._id;
            const gender = req.user.gender === "male" ? "female" : "male";

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const skip = (page-1) * limit;
            
            const {acceptedFriendIds, pendingSentIds} = await getFriendStatus(authUserId);
            
            const totalCount = await User.countDocuments({
                gender,
                role: "client"
            });
            const totalPages = Math.ceil(totalCount / limit);
            
            const matchesUser = await User.find({
                gender,
                role: "client",
                _id: { $nin: [...acceptedFriendIds, authUserId] }
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself hobbies lastActive").populate('files')
            .sort({createdAt: -1})
            .limit(limit)
            .skip(skip);

            const maskedUsers = matchesUser.map(user => {
                return {
                    ...user.toObject(),
                    requestSent: pendingSentIds.includes(String(user._id)),
                    phone: maskedPhone(user.phone),
                    email: maskedEmail(user.email),
                };
            })
            
            return res.json({
                "status": true,
                "message": "Matches user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    matchesUser:maskedUsers,
                },
            });
        } catch (error) {
            return res(422).json({
                "status": false,
                "message": error.message
            })
        }
    }

    static async decreaseLimit (req, res){
        const decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
        const user = await User.findByIdAndUpdate(decoded._id, {
            $inc:{daily_view_limit: -1},
        });
    }

    static async nearMe (req, res) {
        try {
            const authUserId = req.user._id;
            const gender = req.user.gender === "male" ? "female" : "male";

            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const {acceptedFriendIds, pendingSentIds} = await getFriendStatus(authUserId);

            const skip = (page-1) * limit;


            const totalCount = await User.countDocuments({
                gender,
                role: "client"
            });
            const totalPages = Math.ceil(totalCount / limit);

            const nearMe = await User.find({
                gender,
                role: "client",
                _id: { $nin: [...acceptedFriendIds, authUserId] }
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself hobbies lastActive").populate('files')
            .sort({createdAt: -1})
            .limit(limit)
            .skip(skip);

            const maskedUsers = nearMe.map(user => {
                return {
                    ...user.toObject(),
                    requestSent: pendingSentIds.includes(String(user._id)),
                    phone: maskedPhone(user.phone),
                    email: maskedEmail(user.email),
                };
            })

            return res.json({
                "status": true,
                "message": "Near me user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    nearMe: maskedUsers,
                },
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error.message
            })
        }
    }
    static async recentlyJoin(req, res) {
        try {            
            const authUserId = req.user._id;
            const gender = req.user.gender == "male" ? "female" : "male";
            const limit = parseInt(req.query.limit) || 10;
            const {acceptedFriendIds, pendingSentIds} = await getFriendStatus(authUserId);
            const page = parseInt(req.query.page) || 1;

            const totalCount = await User.countDocuments({
                gender,
                role: "client",
                _id: { $nin: [...acceptedFriendIds, authUserId] }
            });

            const totalPages = Math.ceil(totalCount / limit);
            const skip = (page-1) * limit;

            const data = await User.find({
                gender,
                role: "client"
            }).select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself hobbies lastActive").populate('files')
            .sort({createdAt: -1}).limit(limit).skip(skip);
            
            const maskedUsers = data.map(user => {
                return {
                    ...user.toObject(),
                    requestSent: pendingSentIds.includes(String(user._id)),
                    phone: maskedPhone(user.phone),
                    email: maskedEmail(user.email),
                };
            })

            return res.json({
                "status": true,
                "message": "Recently user fetched successfully.",
                "data": {
                    totalCount,
                    totalPages,
                    data:maskedUsers,
                },
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error.message
            })
        }
    }
    
    static async setUserPlan(req, res) {
        try {
            const userId = req.user._id;
            const plan = await Plan.findOne({_id: req.body.plan_id})
            
            await User.findByIdAndUpdate(userId, {
                plan: req.body.plan_id,
                contactViewsRemaining: plan.contact_view_limit, 
                planActivatedAt: Date.now(),
                planExpiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            })
            
            return res.json({
                "status": true,
                "message": "Plan activate for the user.",
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error.message
            })
        }
    }

    static async viewContact(req, res) {
        try {
            const user = await User.findOne({
                _id: req.body.userId
            }).select("phone");

            await User.findByIdAndUpdate(req.user._id, {
                $inc: { contactViewsRemaining: -1 }
            });

            return res.json({
                "status": true,
                "message": "Contact number fetched successfully.",
                "data": user,
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error.message
            })
        }
    }

    static async detail(req, res) {
        try {
            const authUserId = req.user._id;

            const user = await User.findById(req.params.userId)
                .select("first_name last_name email role phone gender dob religion community live live_with_your_family marital_status diet height highest_qualification college_name work_with income about_yourself hobbies lastActive")
                .populate('files');

            const { acceptedFriendIds, pendingSentIds } = await getFriendStatus(authUserId);

            const userObj = user.toObject();

            const responseUser = {
                ...userObj,
                phone: maskedPhone(userObj.phone),
                email: maskedEmail(userObj.email),
                requestSent: pendingSentIds.includes(String(user._id))
            };

            return res.json({
                "status": true,
                "message": "User detial fetched successfully.",
                "data": responseUser,
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error.message
            })
        }
    }
}


module.exports = UserController;