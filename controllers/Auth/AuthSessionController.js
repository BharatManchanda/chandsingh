const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config()
const removeKeys = require("../../helpers/removeKeys")

class AuthSessionController {
    static async login (request, response) {
        const {email, password} = request.body;
        const user = await User.findOne({email});
        if (!user) throw new Error("Invalid credentials.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials.");
        const {_id, first_name, last_name} = user;
        const token = jwt.sign({ _id, first_name, last_name  }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
        user.tokens.push({token, issueAt: new Date()});
        await user.save();
        return response.status(200).json({
            status: true,
            message: "User login successfully.",
            data: removeKeys(["tokens", "password"], user.toObject()),
            token,
        });
    }
    static async logout (request, response) {
        try {
            const token = request.headers.authorization;
            if (!token) {
                return request.status(401).json({ message: "Token not provided." });
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            // Find the user by ID
            const user = await User.findOne({_id: decoded._id})
            user.tokens = user.tokens.filter(t => t.token != token)
            await user.save();
            return response.status(200).json({
                status: true,
                message: "User logout successfully.",
            });
        } catch (error) {
            return response.status(422).json({
                "status": false,
                "message": error
            });
        }
    }
    static async register (request, response) {
        try {
            const {first_name, last_name, email, password, role, phone, gender, dob, religion, community, live, live_with_your_family, marital_status, diet, height, highest_qualification, college_name,  work_with,  income, about_yourself } = request.body;
            const user = new User({
                first_name,
                last_name,
                email,
                password,
                role,
                phone,
                gender,
                dob,
                religion,
                community,
                live,
                live_with_your_family,
                marital_status,
                diet,
                height,
                highest_qualification,
                college_name,
                 work_with,
                 income,
                about_yourself,
            });
            user.save();
            
            return response.json({
                "status": true,
                "message": "User register successfully.",
                "data": user,
            })
        } catch (error) {
            return response.status(422).json({
                "status": false,
                "message": error
            })
        }
    }

    static async getMe (request, response) {
        try {
            const decoded = jwt.verify(request.headers.authorization, process.env.SECRET_KEY);
            const user = await User.findOne({_id: decoded._id});
            
            return response.status(200).json({
                status: true,
                message: "User detail fetched successfully.",
                data: removeKeys(["tokens", "password"], user.toObject())
            });
        } catch (error) {
            return response.status(200).json({
                "status": false,
                "message": error,
            });
        }
    }
}

module.exports = AuthSessionController;