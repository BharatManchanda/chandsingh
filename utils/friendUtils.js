const FriendRequest = require('../models/FriendRequest'); // adjust path

const getFriendStatus = async (authUserId) => {
    const friendRequests = await FriendRequest.find({
        $or: [
            { senderId: authUserId },
            { receiverId: authUserId }
        ]
    });

    const acceptedFriendIds = [];
    const pendingSentIds = [];

    friendRequests.forEach(fr => {
        const isSender = String(fr.senderId) === String(authUserId);
        const otherUserId = isSender ? fr.receiverId : fr.senderId;

        if (fr.status === 'accept') {
            acceptedFriendIds.push(String(otherUserId));
        } else if (fr.status === 'pending' && isSender) {
            pendingSentIds.push(String(otherUserId));
        }
    });

    return { acceptedFriendIds, pendingSentIds };
};

module.exports = { getFriendStatus };
