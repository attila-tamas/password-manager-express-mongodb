import { body } from "express-validator";

import Key from "../../models/key-model";

const keyValidator = {
	validateNewKey() {
		return [
			body("password")
				.trim()

				.notEmpty()
				.withMessage("The password must not be empty"),
		];
	},

	validateUpdateKey() {
		return [
			body("id")
				.trim()

				.custom(async (value, { req }) => {
					const _id = value;

					// check if the _id is a valid ObjectId
					if (_id.match(/^[0-9a-fA-F]{24}$/)) {
						const key = await Key.findOne({ _id, userId: (<any>req).user.id })
							.lean()
							.exec();

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
	},

	validateDeleteKey() {
		return [
			body("id")
				.trim()

				.custom(async (value, { req }) => {
					const _id = value;

					// check if the _id is a valid ObjectId
					if (_id.match(/^[0-9a-fA-F]{24}$/)) {
						const key = await Key.findOne({ _id, userId: (<any>req).user.id })
							.lean()
							.exec();

						if (!key) {
							throw new Error("Key not found");
						}
					} else {
						throw new Error("Invalid id");
					}

					return true;
				}),
		];
	},
};

export default keyValidator;
