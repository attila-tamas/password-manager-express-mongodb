import otp from "@util/otpHandler";
import bcrypt from "bcrypt";
import { body, cookie, query } from "express-validator";

import Key from "@models/key.model";
import User from "@models/user.model";

const emailValidator = () =>
	body("email")
		.notEmpty()
		.withMessage("The email address must not be empty")

		.isEmail()
		.withMessage("Invalid email address");

const unusedEmailValidator = () =>
	emailValidator() //
		.custom(async email => {
			const foundUser = await User.findOne({ email }).lean().exec();

			if (foundUser) {
				throw new Error("Email address is already in use");
			}
		});

const usedEmailValidator = () =>
	emailValidator() //
		.custom(async email => {
			const foundUser = await User.findOne({ email }).exec();

			if (!foundUser) {
				throw new Error("Email address is not registered");
			}
		});

const loginValidator = () =>
	body() //
		.custom(async ({ email, password }) => {
			const foundUser = await User.findOne({ email }).exec();

			if (foundUser) {
				const arePasswordsEqual = await bcrypt.compare(password, foundUser.password);

				if (!arePasswordsEqual) {
					throw new Error("Incorrect password");
				}
			}
		});

const passwordValidator = () =>
	body("password")
		.trim()

		.notEmpty()
		.withMessage("The password must not be empty");

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

const otpValidator = () =>
	body("token")
		.trim()

		.notEmpty()
		.withMessage("The verification code must not be empty")

		.custom(async token => {
			const isValid = otp.verify(token, otp.secret);

			if (!isValid) {
				throw new Error("Invalid or expired code");
			}
		});

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

export {
	emailValidator,
	unusedEmailValidator,
	usedEmailValidator,
	loginValidator,
	passwordValidator,
	accountActivationValidator,
	otpValidator,
	cookieValidator,
	titleValidator,
	paginationValidator,
	idValidator,
};