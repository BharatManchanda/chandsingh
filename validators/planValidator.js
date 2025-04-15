const { body, param } = require('express-validator');

const planCreateOrEditValidator = [
    body('type')
        .notEmpty().withMessage('Type is required.')
        .isString().withMessage('Type must be a string.'),

    body('symbol')
        .notEmpty().withMessage('Symbol is required.')
        .isString().withMessage('Symbol must be a string.'),

    body('mrp')
        .notEmpty().withMessage('MRP is required.')
        .isNumeric().withMessage('MRP must be a number.'),

    body('price')
        .notEmpty().withMessage('Price is required.')
        .isNumeric().withMessage('Price must be a number.'),

    body('messages')
        .notEmpty().withMessage('Messages are required.')
        .isArray().withMessage('Messages must be an array.'),

    body('valid_till')
        .notEmpty().withMessage('Valid till is required.')
        .isNumeric().withMessage('Valid till must be a number.'),

    body('status')
        .optional()
        .isBoolean().withMessage('Status must be a boolean.'),

    body('_id')
        .optional()
        .isMongoId().withMessage('ID must be a valid Mongo ID.')
];

const planDeleteValidator = [
    param('_id')
        .isMongoId().withMessage('Invalid plan ID'),
]

module.exports = { planCreateOrEditValidator, planDeleteValidator };
