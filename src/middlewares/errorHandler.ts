import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const errorHandler = (req: Request, res: Response, next: NextFunction) => {
	const result = validationResult(req).array();

	if (result.length) {
		const error = result[0]?.msg; // only return the first error at once
		return res.status(400).json({ message: error });
	}

	return next();
};

export default errorHandler;
