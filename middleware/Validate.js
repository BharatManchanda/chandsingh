const { validationResult } = require('express-validator');
exports.Validate = (req, res, next) => {
	const result = validationResult(req);

	if (!result.isEmpty()) {
		const allErrors = result.array();
		const uniqueErrors = {};
		for (const err of allErrors) {
			if (uniqueErrors[err.path] == undefined) {
				uniqueErrors[err.path] = err.msg;
			}
		}
		return res.status(422).json({
			status: false,
			message: 'Validation failed.',
			errors: uniqueErrors,
		});
	}
	next();
};

