const { body } = require('express-validator');
const User = require('../models/User');
const mongoose = require('mongoose');
const File = require('../models/File');

exports.loginValidator = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid'),
    body('password')
        .notEmpty().withMessage('Password is required'),
];


exports.registerValidator = [
    body("first_name").notEmpty().withMessage("First name is required"),
    body("last_name").notEmpty().withMessage("Last name is required"),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be valid')
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                return Promise.reject('Email already in use');
            }
            return true;
        }),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role")
        .optional()
        .isIn(["client", "admin"]) // assuming roles
        .withMessage("Invalid role"),
    body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
    body("gender").optional().isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("dob").optional().isISO8601().withMessage("Invalid date of birth"),
    body("religion").optional().isString(),
    body("community").optional().isString(),
    body("live.country").optional().isString(),
    body("live.city").optional().isString(),

    body("live_with_your_family")
        .optional()
        .isIn([0, 1])
        .withMessage("live_with_your_family must be 0 or 1"),

    body("marital_status").optional().isString(),
    body("diet").optional().isString(),
    body("height").optional().isString(),
    body("highest_qualification").optional().isString(),
    body("college_name").optional().isString(),
    body("work_with").optional().isString(),

    body("income.type").optional().isString(),
    body("income.amount_range").optional().isString(),
    body("about_yourself").optional().isString(),
    // body('image').custom((value, { req }) => {
    //     if (!req.file) {
    //         throw new Error('Image is required and must be in jpg, jpeg or png format');
    //     }
    //     return true;
    // }),
];

exports.profileImageCreateValidator = [
    body('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Image is required and must be in jpg, jpeg or png format');
        }
        return true;
    }),

    body('image').custom(async (value, { req }) => {
        const userId = req.user._id; // assuming auth middleware sets req.user
        const alreadyUploadedCount = await File.countDocuments({ fileable_id: userId, fileable_type: "User" });

        const total = alreadyUploadedCount + 1;

        if (total > 5) {
            return Promise.reject(`You can upload maximum 5 images in total. You already uploaded.`);
        }

        return true;
    })
    
]

exports.profileImageUpdateValidator = [
    body('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Image is required and must be in jpg, jpeg or png format');
        }
        return true;
    }),
    body('_id')
    .notEmpty().withMessage('_id is required.')
    .custom(async (_id, { req }) => {
        // 1. Mongoose ID validation
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return Promise.reject('Invalid _id format.');
        }

        // 2. Update the friend req
        const file = await File.findOne({
            _id: _id,

        });
        
        if (!file) {
            return Promise.reject('_id is wrong.');
        }
    })
];

exports.profileImageCreateMultipleValidator = [
    body('image')
        .custom((value, { req }) => {
            if (!req.files || req.files.length === 0) {
                return Promise.reject('Please upload at least one image.');
            }

            const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            for (let file of req.files) {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    return Promise.reject(`File type ${file.mimetype} not allowed. Only jpg, jpeg, png are accepted.`);
                }
            }

            return true;
        }),

    body('image')
        .custom(async (value, { req }) => {
            const userId = req.user._id; // assuming auth middleware sets req.user
            const alreadyUploadedCount = await File.countDocuments({ fileable_id: userId, fileable_type: "User" });

            const newUploadCount = req.files.length;
            const total = alreadyUploadedCount + newUploadCount;

            if (total > 5) {
                return Promise.reject(`You can upload maximum 5 images in total. You already uploaded ${alreadyUploadedCount}.`);
            }

            return true;
        })
]