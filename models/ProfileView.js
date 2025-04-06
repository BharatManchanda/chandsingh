const mongoose = require("mongoose");

const ProfileViewSchema = mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    viewerId: {
        type: String,
        required: false,
    },
    viewedAt: {
        type: Date,
        required: false,
    },
},{
    timestamps: true,
})

const ProfileView = mongoose.model(ProfileView, ProfileViewSchema);
module.exports = ProfileView;