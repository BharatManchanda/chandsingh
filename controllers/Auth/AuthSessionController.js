const User = require("../../models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config()
const removeKeys = require("../../helpers/removeKeys");
const FileService = require("../../services/FileService");
const File = require("../../models/File");

class AuthSessionController {
    static async login (req, res) {
        try {
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
        } catch (error) {
            return res.status(422).json({
                "status": false,
                "message": error.message
            })
        }
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
            const {first_name, last_name, email, password, role, phone, gender, dob, religion, community, live, live_with_your_family, marital_status, diet, height, highest_qualification, college_name,  work_with,  income, about_yourself, hobbies} = req.body;
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
                hobbies,
            });
            await user.save();

            // Create JWT token
            const { _id } = user;
            const token = jwt.sign({ _id, first_name, last_name }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });

            // Push token to the user's tokens array
            user.tokens.push({ token, issueAt: new Date() });

            // Save the user again to include the token
            await user.save();
            // if (req.file) {
            //     await FileService.uploadFile(req.file, user._id, 'User');
            // }
            
            return res.json({
                "status": true,
                "message": "User register successfully.",
                "data": removeKeys(["tokens", "password"], user.toObject()),
                token,
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
            const user = await User.findOne({_id: decoded._id}).populate('files');
            
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

    static async addImage(req, res) {
        try {
            if (req.file) {
                await FileService.uploadFile(req.file, req.user._id, 'User');
            }
            return res.status(200).json({
                status: true,
                message: "User image upload successfully.",
            });
        } catch (error) {
            return res.status(200).json({
                "status": false,
                "message": error,
            });
        }
    }
    
    static async updateImage(req, res) {
        try {
            if (req.file) {
                const {_id} = req.body
                await FileService.updateFile(req.file, _id, req.user._id, 'User');
            }
            return res.status(200).json({
                status: true,
                message: "User image update successfully.",
            });
        } catch (error) {
            return res.status(200).json({
                "status": false,
                "message": error,
            });
        }
    }

    static async deleteImage(req, res) {
        try {
            const { _id } = req.body;
            await FileService.deleteFile(_id);
            return res.status(200).json({
                status: true,
                message: "User image delete successfully.",
            });
        } catch (error) {
            return res.status(200).json({
                "status": false,
                "message": error,
            });
        }
    }

    static async listImage(req, res) {
        try {
            const images = await File.find({
                fileable_id: req.user._id,
                fileable_type: "User" 
            });
            return res.status(200).json({
                status: true,
                message: "User image fetch successfully.",
                data: images,
            });
        } catch (error) {
            return res.status(200).json({
                "status": false,
                "message": error,
            });
        }
    }

    static async addMultiImage(req, res) {
        try {
            console.log("tested");
            
            req.files.map(async(file) => {
                await FileService.uploadFile(file, req.user._id, 'User');
            });
            return res.json({
                "status": true,
                "message": "Upload multiple images.",
            })
        } catch (error) {
            return res.status(200).json({
                "status": false,
                "message": error,
            });
        }
    }
}

module.exports = AuthSessionController;