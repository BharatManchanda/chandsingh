const IgnoredUser = require("../models/IgnoredUser");

const getIgnoredUserList = async (authUserId) => {
    const ignoredUsers = await IgnoredUser.find({
        userId: authUserId,
    }).select("ignoredUserId");;

    return ignoredUsers.map(user => user.ignoredUserId);
}

module.exports = { getIgnoredUserList };