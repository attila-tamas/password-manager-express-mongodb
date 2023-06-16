import { Router } from "express";

import UserController from "@controllers/user-controller";
import errorHandler from "@middlewares/errorHandler";
import { sendVerificationEmailLimiter } from "@middlewares/rate-limiters";
import userValidator from "@middlewares/validation/user-request-validator";
import verifyJWT from "@middlewares/verify-jwt";

export default class UserRoutes {
	public router;

	private userController;
	private userValidator;

	constructor(userController: UserController) {
		this.userController = userController;
		this.userValidator = userValidator;

		this.router = Router();

		this.setRoutes();
	}

	private setRoutes() {
		this.router.post(
			"/api/user/resend-verification-email",
			sendVerificationEmailLimiter,
			this.userValidator.validateResendVerificationEmail(),
			errorHandler,
			this.userController.ResendVerificationEmail
		);

		this.router.get(
			"/api/user/activate",
			this.userValidator.validateActivation(),
			errorHandler,
			this.userController.activateUser
		);

		this.router.post(
			"/api/user/request-password-change",
			this.userValidator.validatePasswordChangeRequest(),
			errorHandler,
			this.userController.RequestPasswordChange
		);

		this.router.post(
			"/api/user/change-password",
			this.userValidator.validateChangePassword(),
			errorHandler,
			this.userController.ChangePassword
		);

		this.router.delete(
			"/api/user/delete", //
			verifyJWT,
			this.userController.DeleteUser
		);
	}
}
