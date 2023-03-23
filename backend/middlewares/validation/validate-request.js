const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
	const result = validationResult(req).array();
	if (result.length) {
		const error = result[0].msg;
		return res.status(400).json({ message: error });
	}

	next();
};

module.exports = {
	validateRequest,
};
