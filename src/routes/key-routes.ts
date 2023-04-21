import { Router } from "express";

import keyValidator from "../middlewares/validation/key-request-validator";
import KeyController from "../controllers/key-controller";
import verifyJWT from "../middlewares/verify-jwt";
import validateRequest from "../middlewares/validation/request-validator";

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
			validateRequest,
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
			validateRequest,
			this.keyController.UpdateKey
		);

		this.router.delete(
			"/api/key/delete",
			verifyJWT,
			this.keyValidator.validateDeleteKey(),
			validateRequest,
			this.keyController.DeleteKey
		);

		this.router.delete(
			"/api/key/delete/all",
			verifyJWT,
			this.keyController.DeleteAllKeysByUserId
		);
	}
}
