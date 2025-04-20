const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    mimetype: String,
    size: Number,

    fileable_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    fileable_type: { type: String, required: true }, // e.g., "User", "Post"
    
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);