const mongoose = require("mongoose");

const FriendRequestSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        required: true,
    }
}, {
    timestamps: true,
});

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
module.exports = FriendRequest;