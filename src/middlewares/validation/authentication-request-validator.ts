import User from "../../models/user-model";
import { body, cookie, param } from "express-validator";
import bcrypt from "bcrypt";

export default class AuthenticationValidator {
	public readonly validateRegistration;
	public readonly validateActivation;
	public readonly validateLogin;
	public readonly validateRefresh;

	constructor() {
		this.validateRegistration = this.getRegistrationValidator();
		this.validateActivation = this.getActivationValidator();
		this.validateLogin = this.getLoginValidator();
		this.validateRefresh = this.getRefreshValidator();
	}

	private getRegistrationValidator() {
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
	}

	private getActivationValidator() {
		return [
			param("activatorToken")
				.trim()

				.custom(async value => {
					const activatorToken = value;

					const user = await User.findOne({ activatorToken }).lean().exec();

					if (!user) {
						throw new Error("Account is already activated");
					}

					return true;
				}),
		];
	}

	private getLoginValidator() {
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
	}

	private getRefreshValidator() {
		return [
			cookie("jwt") //
				.trim()

				.notEmpty()
				.withMessage("Unauthorized"),
		];
	}
}
