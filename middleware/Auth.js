const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config()

const auth = async (request, response, next)  => {
    try {
        const token = request.headers.authorization;
        if (!token) {
            return response.status(401).json({
                status: false,
                message: "Authorization token is missing.",
            });
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({_id:decoded._id})
        
        if (!user) {
            return response.status(401).json({
                status: false,
                message: "User not found.",
            });
        } else {
            request.user = user
        }
        const tokenExists = user.tokens.some((t) => t.token === token);
        if (!tokenExists) {
            return response.status(401).json({
                status: false,
                message: "Token doesn't exist.",
            });
        }
        next();
    } catch (error) {
        return response.status(404).json({
            message: error.message || "Authentication failed",
        });
    }
}

module.exports = auth;