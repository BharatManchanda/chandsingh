const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config()
const removeKeys = require("../../helpers/removeKeys");
const FileService = require("../../services/FileService");

class AuthSessionController {
    static async login (req, res) {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) throw new Error("Invalid credentials.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials.");
        const {_id, first_name, last_name} = user;
        const token = jwt.sign({ _id, first_name, last_name  }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });
        user.tokens.push({token, issueAt: new Date()});
        await user.save();
        return res.status(200).json({
            status: true,
            message: "User login successfully.",
            data: removeKeys(["tokens", "password"], user.toObject()),
            token,
        });
    }
    static async logout (req, res) {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return req.status(401).json({ message: "Token not provided." });
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            // Find the user by ID
            const user = await User.findOne({_id: decoded._id})
            user.tokens = user.tokens.filter(t => t.token != token)
            await user.save();
            return res.status(200).json({
                status: true,
                message: "User logout successfully.",
            });
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error
            });
        }
    }
    static async register (req, res) {
        try {
            const {first_name, last_name, email, password, role, phone, gender, dob, religion, community, live, live_with_your_family, marital_status, diet, height, highest_qualification, college_name,  work_with,  income, about_yourself } = req.body;
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
            
            // if (req.file) {
            //     await FileService.uploadFile(req.file, user._id, 'User');
            // }
            
            return res.json({
                "status": true,
                "message": "User register successfully.",
                "data": user,
            })
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error
            })
        }
    }

    static async getMe (req, res) {
        try {
            const decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
            const user = await User.findOne({_id: decoded._id}).populate().populate('files');
            
            return res.status(200).json({
                status: true,
                message: "User detail fetched successfully.",
                data: removeKeys(["tokens", "password"], user.toObject())
            });
        } catch (error) {
            return res.status(200).json({
                "status": false,
                "message": error,
            });
        }
    }
}

module.exports = AuthSessionController;