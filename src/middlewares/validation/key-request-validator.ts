import { body, query } from "express-validator";

import Key from "../../models/key-model";

export default class KeyValidator {
	public readonly validateNewKey;
	public readonly validateUpdateKey;
	public readonly validateDeleteKey;

	constructor() {
		this.validateNewKey = this.getNewKeyValidator();
		this.validateUpdateKey = this.getUpdateKeyValidator();
		this.validateDeleteKey = this.getDeleteKeyValidator();
	}

	private getNewKeyValidator() {
		return [
			body("password")
				.trim()

				.notEmpty()
				.withMessage("The password must not be empty"),
		];
	}

	private getUpdateKeyValidator() {
		return [
			query("id")
				.trim()

				.custom(async value => {
					const _id = value;

					// check if the _id is a valid ObjectId
					if (_id.match(/^[0-9a-fA-F]{24}$/)) {
						const key = await Key.findOne({ _id }).lean().exec();

						if (!key) {
							throw new Error("Key not found");
						}
					} else {
						throw new Error("Invalid id");
					}

					return true;
				}),

			body("title")
				.trim()

				.notEmpty()
				.withMessage("The title must not be empty"),

			body("password")
				.trim()

				.isLength({ min: 8, max: 32 })
				.withMessage("The password must be between 8 and 32 characters long"),
		];
	}

	private getDeleteKeyValidator() {
		return [
			query("id")
				.trim()

				.custom(async value => {
					const _id = value;

					// check if the _id is a valid ObjectId
					if (_id.match(/^[0-9a-fA-F]{24}$/)) {
						const key = await Key.findOne({ _id }).lean().exec();

						if (!key) {
							throw new Error("Key not found");
						}
					} else {
						throw new Error("Invalid id");
					}

					return true;
				}),
		];
	}
}
