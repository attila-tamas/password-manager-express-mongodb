import { Router } from "express";

import KeyController from "@controllers/key-controller";
import errorHandler from "@middlewares/errorHandler";
import keyValidator from "@middlewares/validation/key-request-validator";
import verifyJWT from "@middlewares/verify-jwt";

export default class KeyRoutes {
	public router;

	private keyController;
	private keyValidator;

	constructor(keyController: KeyController) {
		this.keyController = keyController;
		this.keyValidator = keyValidator;

		this.router = Router();

		this.setRoutes();
	}

	private setRoutes() {
		this.router.post(
			"/api/key/new",
			verifyJWT,
			this.keyValidator.validateNewKey(),
			errorHandler,
			this.keyController.CreateNewKey
		);

		this.router.get(
			"/api/key", //
			verifyJWT,
			this.keyController.GetKeysByKeyword
		);

		this.router.patch(
			"/api/key/update",
			verifyJWT,
			this.keyValidator.validateUpdateKey(),
			errorHandler,
			this.keyController.UpdateKey
		);

		this.router.delete(
			"/api/key/delete",
			verifyJWT,
			this.keyValidator.validateDeleteKey(),
			errorHandler,
			this.keyController.DeleteKey
		);

		this.router.delete(
			"/api/key/delete/all",
			verifyJWT,
			this.keyController.DeleteAllKeysByUserId
		);
	}
}
