import { Router } from "express";

import validateRequest from "../middlewares/validation/request-validator";
import AuthenticationController from "../controllers/authentication-controller";
import AuthenticationValidator from "../middlewares/validation/authentication-validator";
import limitLoginAttempts from "../middlewares/login-limiter";

export default class AuthenticationRoutes {
	public router;

	private authController;
	private authValidator;

	constructor(authenticationController: AuthenticationController) {
		this.authController = authenticationController;
		this.authValidator = new AuthenticationValidator();

		this.router = Router();

		this.setRoutes();
	}

	private setRoutes() {
		this.router.post(
			"/api/user/register",
			this.authValidator.validateRegistration,
			validateRequest,
			this.authController.registerUser
		);

		this.router.get(
			"/api/user/activate/:activatorToken",
			this.authValidator.validateActivation,
			validateRequest,
			this.authController.activateUser
		);

		this.router.post(
			"/api/user/login",
			limitLoginAttempts,
			this.authValidator.validateLogin,
			validateRequest,
			this.authController.loginUser
		);

		this.router.get(
			"/api/user/logout",
			this.authValidator.validateSession,
			validateRequest,
			this.authController.logoutUser
		);

		this.router.get(
			"/api/user/current",
			this.authValidator.validateSession,
			validateRequest,
			this.authController.getCurrentUser
		);
	}
}
