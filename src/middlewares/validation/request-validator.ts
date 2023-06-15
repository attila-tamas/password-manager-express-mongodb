import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const result = validationResult(req).array();
	if (result.length) {
		const error = result[0]?.msg;
		return res.status(400).json({ message: error });
	}

	return next();
};

export default validateRequest;
