import { Router } from "express";

import ValidationController from "@controllers/validation-controller";
import errorHandler from "@middlewares/errorHandler";
import { emailValidator, passwordValidator } from "@middlewares/validators";

export default class ValidationRoutes {
	public router;

	constructor(validationController: ValidationController) {
		this.router = Router();

		this.setRoutes(validationController);
	}

	private setRoutes(validationController: ValidationController) {
		this.router.post(
			"/api/validate/login/email", //
			emailValidator(),
			errorHandler,
			validationController.validateLoginEmail
		);

		this.router.post(
			"/api/validate/login/password", //
			passwordValidator(),
			errorHandler,
			validationController.validateLoginPassword
		);

		this.router.post(
			"/api/validate/register/email", //
			emailValidator(),
			errorHandler,
			validationController.validateRegisterEmail
		);
	}
}
