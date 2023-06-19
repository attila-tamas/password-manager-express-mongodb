import { Router } from "express";

import errorHandler from "@middlewares/errorHandler.middleware";
import { loginLimiter } from "@middlewares/rateLimiters.middleware";
import { cookieValidator } from "@middlewares/validators.middleware";

import AuthenticationController from "@controllers/authentication.controller";

export default class AuthenticationRoutes {
	public router;

	constructor(authenticationController: AuthenticationController) {
		this.router = Router();
		this.setRoutes(authenticationController);
	}

	private setRoutes(authController: AuthenticationController) {
		this.router.post(
			"/api/auth/register", //
			authController.registerUser
		);

		this.router.post(
			"/api/auth/login", //
			loginLimiter,
			authController.loginUser
		);

		this.router.post(
			"/api/auth/logout", //
			authController.logoutUser
		);

		this.router.get(
			"/api/auth/refresh",
			cookieValidator(),
			errorHandler,
			authController.refreshToken
		);
	}
}
