const mongoose = require("mongoose");

const ProfileViewSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    viewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps: true,
})

const ProfileView = mongoose.model('ProfileView', ProfileViewSchema);
module.exports = ProfileView;