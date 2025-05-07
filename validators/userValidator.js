const Plan = require("../models/Plan");
const { body } = require('express-validator');
const mongoose = require("mongoose");
const User = require("../models/User");

const userPlanSetValidator = [
    body('plan_id')
        .notEmpty().withMessage('Plan Id is required')
        .custom(async (plan_id) => {
            // 1. Mongoose ID validation
            if (!mongoose.Types.ObjectId.isValid(plan_id)) {
                return Promise.reject('Invalid Plan ID format.');
            }

            // 2. Check if plan is exists with active status
            const plan = await Plan.find({ _id: plan_id, status: true });
            if (!plan) {
                return Promise.reject('Plan does not exist.');
            }
        })
];


const contactNumberView = [
    body('userId')
        .notEmpty().withMessage('User Id is required')
        .custom(async (userId, {req}) => {
            // 1. Mongoose ID validation
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return Promise.reject('Invalid User ID format.');
            }

            // 2. Check if user exists
            const viewer = await User.findById(userId).select('contactViewsRemaining planExpiredAt');
            if (!viewer) {
                return Promise.reject('Viewer does not exist.');
            }

            // 3. Check it plan expire or not
            const user = await User.findById(req.user._id).select('contactViewsRemaining planExpiredAt');
            const now = new Date();
            if (user.planExpiredAt && now > user.planExpiredAt) {
                return Promise.reject('Your plan has expired. Please renew to continue.');
            }

            // 4. Limit check contact view remaining
            if (user.contactViewsRemaining <= 0) {
                return Promise.reject('You have reached your contact view limit.');
            }
        })
];

const userDetailValidator = [
    
]

module.exports = { contactNumberView, userPlanSetValidator, userDetailValidator };