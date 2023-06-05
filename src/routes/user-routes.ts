import { Router } from "express";

import UserController from "../controllers/user-controller";
import limitVerificationEmailRequests from "../middlewares/send-email-limiter";
import validateRequest from "../middlewares/validation/request-validator";
import userValidator from "../middlewares/validation/user-request-validator";
import verifyJWT from "../middlewares/verify-jwt";

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
			limitVerificationEmailRequests,
			this.userValidator.validateResendVerificationEmail(),
			validateRequest,
			this.userController.ResendVerificationEmail
		);

		this.router.post(
			"/api/user/request-password-change",
			this.userValidator.validatePasswordChangeRequest(),
			validateRequest,
			this.userController.RequestPasswordChange
		);

		this.router.post(
			"/api/user/change-password",
			this.userValidator.validateChangePassword(),
			validateRequest,
			this.userController.ChangePassword
		);

		this.router.delete(
			"/api/user/delete", //
			verifyJWT,
			this.userController.DeleteUser
		);
	}
}
