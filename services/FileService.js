// services/FileService.js
const File = require('../models/File');
const fs = require('fs');
const path = require('path');

class FileService {
    static async uploadFile(file, fileable_id, fileable_type) {
        if (!file) throw new Error('No file provided');

        const newFile = new File({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size,
            fileable_id,
            fileable_type,
        });

        return await newFile.save();
    }

    static async updateFile(file, _id, fileable_id, fileable_type) {
        if (!file) throw new Error('No file provided');

        // Delete existing file if it exists
        const oldFile = await File.findOne({ _id });
        if (oldFile) await this.deleteFile(_id);

        // Upload new one
        return await this.uploadFile(file, fileable_id, fileable_type);
    }

    static async deleteFile(fileId) {
        const file = await File.findById(fileId);
        if (!file) return;

        // Remove physical file
        try {
            fs.unlinkSync(path.resolve(file.path));
        } catch (err) {
            console.error('Error deleting file from disk:', err.message);
        }

        // Remove from DB
        return await File.deleteOne({ _id: fileId });
    }

    static async deleteAllFilesFor(fileable_id, fileable_type) {
        const files = await File.find({ fileable_id, fileable_type });
        for (const file of files) {
            await this.deleteFile(file._id);
        }
    }

    static async getFiles(fileable_id, fileable_type) {
        return await File.find({ fileable_id, fileable_type });
    }
}

module.exports = FileService;
