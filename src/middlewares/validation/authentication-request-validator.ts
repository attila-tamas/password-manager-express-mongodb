import bcrypt from "bcrypt";
import { body, cookie } from "express-validator";
import User from "../../models/user-model";

const authenticationValidator = {
	validateRegistration() {
		return [
			body("email")
				.normalizeEmail()

				.notEmpty()
				.withMessage("The email address must not be empty")

				.isEmail()
				.withMessage("Invalid email address")

				.custom(async value => {
					const email = value;

					const user = await User.findOne({ email }).lean().exec();

					if (user) {
						throw new Error("The given email address is already in use");
					}

					return true;
				}),

			body("password")
				.trim()

				.isLength({ min: 8, max: 32 })
				.withMessage("The password must be between 8 and 32 characters long"),
		];
	},

	validateLogin() {
		return [
			body("email")
				.trim()

				.notEmpty()
				.withMessage("The email address must not be empty")

				.custom(async value => {
					const email = value;

					const user = await User.findOne({ email }).lean().exec();

					if (!user) {
						throw new Error("No account found with the given email address");
					} else if (user.activatorToken) {
						throw new Error("Account is not activated");
					}

					return true;
				}),

			body("password")
				.trim()

				.notEmpty()
				.withMessage("The password must not be empty")

				.custom(async (value, { req }) => {
					const email = req.body.email;

					const user = await User.findOne({ email }).lean().exec();

					if (user) {
						const arePasswordsEqual = await bcrypt.compare(value, user.password);
						if (!arePasswordsEqual) {
							throw new Error("Incorrect password");
						}
					} else {
						throw new Error("User not found");
					}

					return true;
				}),
		];
	},

	validateRefresh() {
		return [
			cookie("jwt") //
				.trim()

				.notEmpty()
				.withMessage("Unauthorized"),
		];
	},
};

export default authenticationValidator;
