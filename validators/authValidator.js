const { body } = require('express-validator');
const User = require('../models/User');

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
    body('image').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('Image is required and must be in jpg, jpeg or png format');
        }
        return true;
    }),
];