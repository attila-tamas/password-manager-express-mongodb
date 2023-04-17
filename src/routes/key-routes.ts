import { Router } from "express";

import KeyValidator from "../middlewares/validation/key-request-validator";
import KeyController from "../controllers/key-controller";
import verifyJWT from "../middlewares/verify-jwt";
import validateRequest from "../middlewares/validation/request-validator";

export default class KeyRoutes {
	public router;

	private keyController;
	private keyValidator;

	constructor(keyController: KeyController) {
		this.keyController = keyController;
		this.keyValidator = new KeyValidator();

		this.router = Router();

		this.setRoutes();
	}

	private setRoutes() {
		this.router.post(
			"/api/key/new",
			verifyJWT,
			this.keyValidator.validateNewKey,
			validateRequest,
			this.keyController.CreateNewKey
		);

		this.router.get(
			"/api/key/all", //
			verifyJWT,
			this.keyController.GetAllKeysByUserId
		);

		this.router.get(
			"/api/key/:keyword", //
			verifyJWT,
			this.keyController.GetKeysByKeyword
		);

		this.router.patch(
			"/api/key/update/:id",
			verifyJWT,
			this.keyValidator.validateUpdateKey,
			validateRequest,
			this.keyController.UpdateKey
		);

		this.router.delete(
			"/api/key/delete/:id",
			verifyJWT,
			this.keyValidator.validateDeleteKey,
			validateRequest,
			this.keyController.DeleteKey
		);
	}
}
