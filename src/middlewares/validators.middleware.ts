import { body, cookie, query } from "express-validator";

import Key from "@models/key.model";
import User from "@models/user.model";

const emailValidator = () =>
	body("email")
		.notEmpty()
		.withMessage("The email address must not be empty")

		.isEmail()
		.withMessage("Invalid email address");

const registrationValidator = () =>
	emailValidator() //
		.custom(async email => {
			const foundUser = await User.findOne({ email }).exec();

			if (!foundUser) {
				throw new Error("The given email address is not registered");
			}
		});

const passwordValidator = () =>
	body("password")
		.trim()

		.notEmpty()
		.withMessage("The password must not be empty")

		.isLength({ min: 12, max: 256 })
		.withMessage("The password must be at least 12 characters long");

const cookieValidator = () =>
	cookie("jwt") //
		.trim()

		.notEmpty()
		.withMessage("Unauthorized");

const titleValidator = () =>
	body("title")
		.trim()

		.notEmpty()
		.withMessage("The title must not be empty");

const paginationValidator = () => [
	// replace the value of the field if it's either an empty string, null, undefined, or NaN.
	query("page").default(1),
	query("limit").default(10),
	query("sort").default("title"),
	query("asc").default(1),
];

const idValidator = () =>
	body("id")
		.trim()

		.custom(async (_id, { req }) => {
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
		});

const accountActivationValidator = () => [
	body("token")
		.trim()

		.notEmpty()
		.withMessage("The verification code must not be empty"),

	emailValidator() //
		.custom(async email => {
			const foundUser = await User.findOne({ email }).exec();

			if (foundUser?.active) {
				throw new Error("Account is already activated");
			}
		}),
];

const tokenValidator = () =>
	body("token")
		.trim()

		.notEmpty()
		.withMessage("The token must not be empty");

export {
	emailValidator,
	registrationValidator,
	passwordValidator,
	cookieValidator,
	titleValidator,
	paginationValidator,
	idValidator,
	accountActivationValidator,
	tokenValidator,
};
