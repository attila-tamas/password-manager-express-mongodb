import { Router } from "express";

import errorHandler from "@middlewares/errorHandler.middleware";
import { emailValidator, passwordValidator } from "@middlewares/validators.middleware";

import ValidationController from "@controllers/validation.controller";

export default class ValidationRoutes {
	/*
		these routes exist to provide real time data validation
		for the authentication fields on the frontend
	*/

	public router;

	constructor(validationController: ValidationController) {
		this.router = Router();
		this.setRoutes(validationController);
	}

	private setRoutes(validationController: ValidationController) {
		this.router.post(
			"/api/validate/register/email",
			emailValidator(),
			errorHandler,
			validationController.validateRegistrationEmail
		);

		this.router.post(
			"/api/validate/register/password",
			passwordValidator(),
			errorHandler,
			validationController.validateRegistrationPassword
		);

		this.router.post(
			"/api/validate/login/email",
			emailValidator(),
			errorHandler,
			validationController.validateLoginEmail
		);

		this.router.post(
			"/api/validate/login/password",
			passwordValidator(),
			errorHandler,
			validationController.validateLoginPassword
		);
	}
}
