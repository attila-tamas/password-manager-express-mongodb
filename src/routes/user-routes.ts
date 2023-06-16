import { Router } from "express";

import errorHandler from "@middlewares/errorHandler";
import { requestEmailLimiter } from "@middlewares/rate-limiters";
import {
	activatorTokenValidator,
	passwordChangeTokenValidator,
	passwordValidator,
	registrationValidator,
} from "@middlewares/validators";
import verifyJWT from "@middlewares/verify-jwt";

import UserController from "@controllers/user-controller";

export default class UserRoutes {
	public router;

	constructor(userController: UserController) {
		this.router = Router();
		this.setRoutes(userController);
	}

	private setRoutes(userController: UserController) {
		this.router.post(
			"/api/user/resend-verification-email",
			requestEmailLimiter,
			registrationValidator(),
			errorHandler,
			userController.ResendVerificationEmail
		);

		this.router.get(
			"/api/user/activate",
			activatorTokenValidator(),
			errorHandler,
			userController.ActivateUser
		);

		this.router.post(
			"/api/user/request-password-change",
			requestEmailLimiter,
			registrationValidator(),
			errorHandler,
			userController.RequestPasswordChange
		);

		this.router.post(
			"/api/user/change-password",
			[registrationValidator(), passwordChangeTokenValidator(), passwordValidator()],
			errorHandler,
			userController.ChangePassword
		);

		this.router.delete(
			"/api/user/delete", //
			verifyJWT,
			userController.DeleteUser
		);
	}
}
