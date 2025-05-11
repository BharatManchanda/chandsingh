// models/IgnoredUser.js
const mongoose = require('mongoose');

const IgnoredUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ignoredUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const IgnoredUser = mongoose.model('IgnoredUser', IgnoredUserSchema);
module.exports = IgnoredUser;
