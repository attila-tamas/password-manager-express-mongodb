import { Router } from "express";

import AuthenticationController from "../controllers/authentication-controller";
import limitLoginAttempts from "../middlewares/login-limiter";
import authenticationValidator from "../middlewares/validation/authentication-request-validator";
import validateRequest from "../middlewares/validation/request-validator";
import verifyJWT from "../middlewares/verify-jwt";

export default class AuthenticationRoutes {
	public router;

	private authController;
	private authValidator;

	constructor(authenticationController: AuthenticationController) {
		this.authController = authenticationController;
		this.authValidator = authenticationValidator;

		this.router = Router();

		this.setRoutes();
	}

	private setRoutes() {
		this.router.post(
			"/api/auth/register",
			this.authValidator.validateRegistration(),
			validateRequest,
			this.authController.registerUser
		);

		this.router.get(
			"/api/auth/activate",
			this.authValidator.validateActivation(),
			validateRequest,
			this.authController.activateUser
		);

		this.router.post(
			"/api/auth/login",
			limitLoginAttempts,
			this.authValidator.validateLogin(),
			validateRequest,
			this.authController.loginUser
		);

		this.router.post(
			"/api/auth/logout", //
			this.authController.logoutUser
		);

		this.router.get(
			"/api/auth/refresh",
			this.authValidator.validateRefresh(),
			validateRequest,
			this.authController.refreshToken
		);

		this.router.get(
			"/api/auth/current", //
			verifyJWT,
			this.authController.getCurrentUser
		);
	}
}
