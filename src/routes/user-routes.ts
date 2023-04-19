import { Router } from "express";

import UserValidator from "../middlewares/validation/user-request-validator";
import UserController from "../controllers/user-controller";
import validateRequest from "../middlewares/validation/request-validator";
import verifyJWT from "../middlewares/verify-jwt";

export default class UserRoutes {
	public router;

	private userController;
	private userValidator;

	constructor(userController: UserController) {
		this.userController = userController;
		this.userValidator = new UserValidator();

		this.router = Router();

		this.setRoutes();
	}

	private setRoutes() {
		this.router.post(
			"/api/user/request-password-change",
			this.userValidator.validatePasswordChangeRequest,
			validateRequest,
			this.userController.RequestPasswordChange
		);

		this.router.post(
			"/api/user/change-password/:id/:token",
			this.userValidator.validateChangePassword,
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
