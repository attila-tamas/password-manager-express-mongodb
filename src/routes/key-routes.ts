import { Router } from "express";

import errorHandler from "@middlewares/errorHandler";
import {
	idValidator,
	paginationValidator,
	passwordValidator,
	titleValidator,
} from "@middlewares/validators";
import verifyJWT from "@middlewares/verify-jwt";

import KeyController from "@controllers/key-controller";

export default class KeyRoutes {
	public router;

	constructor(keyController: KeyController) {
		this.router = Router();
		this.setRoutes(keyController);
	}

	private setRoutes(keyController: KeyController) {
		this.router.post(
			"/api/key/new",
			verifyJWT,
			[titleValidator(), passwordValidator()],
			errorHandler,
			keyController.CreateNewKey
		);

		/*
			route: /api/key?keyword=...&page=...&sort=...&asc=...
			default: { keyword: '', page: '1', limit: 10, sort: 'title', asc: 1 }
		*/
		this.router.get(
			"/api/key",
			verifyJWT,
			paginationValidator(),
			errorHandler,
			keyController.GetPaginatedKeysByKeyword
		);

		this.router.patch(
			"/api/key/update",
			verifyJWT,
			[idValidator(), titleValidator(), passwordValidator()],
			errorHandler,
			keyController.UpdateKey
		);

		this.router.delete(
			"/api/key/delete",
			verifyJWT,
			idValidator(),
			errorHandler,
			keyController.DeleteKey
		);

		this.router.delete(
			"/api/key/delete/all", //
			verifyJWT,
			keyController.DeleteAllKeysByUserId
		);
	}
}
