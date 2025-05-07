const Plan = require("../models/Plan");
const { body } = require('express-validator');
const mongoose = require("mongoose");

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
    
];

const userDetailValidator = [
    
]

module.exports = { contactNumberView, userPlanSetValidator, userDetailValidator };