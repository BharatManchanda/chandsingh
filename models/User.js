const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const TokenSchema = mongoose.Schema({
    token: String,
    issueAt: Date,
})

const UserSchema = mongoose.Schema({
    profile_for: {
        type: String,
        required: true,
        default: 'self',//son, daughter, sister, brother, friend
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'client',
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    dob: {
        type: Date,
        required: false,
    },
    religion: {
        type: String,
        required: false,
    },
    community: {
        type: String,
        required: false,
    },
    live: {
        country:{
            type: String,
            required: false,
        },
        city:{
            type: String,
            required: false,
        }
    },
    live_with_your_family: {
        type: Number, //0-no, 1-yes
        required: false,
    },
    marital_status: {
        type: String,
        required: false,
    },
    diet: {
        type: String,
        required: false,
    },
    height: {
        type: String,
        required: false,
    },
    highest_qualification: {
        type: String,
        required: false,
    },
    college_name:{
        type: String,
        required: false,
    },
    work_with: {
        type: String,
        required: false,
    },
    income:{
        type: {
            type: String,
            required: false,
        },
        amount_range: {
            type: String,
            required: false,
        }
    },
    about_yourself: {
        type: String,
        required: false,
    },
    tokens: {
        type: [TokenSchema],
    },
    daily_view_limit: {
        type: Number,
        default: 10,
    }
},{
    timestamps: true,
});

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});

UserSchema.virtual('files', {
    ref: 'File', // Refers to the File model
    localField: '_id', // _id from the User
    foreignField: 'fileable_id', // matches fileable_id in File
    justOne: false, // many files
    options: { match: { fileable_type: 'User' } } // only include files where fileable_type is 'User'
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;