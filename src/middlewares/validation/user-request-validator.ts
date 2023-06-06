import { body, query } from "express-validator";
import User from "../../models/user-model";

const userValidator = {
	validateResendVerificationEmail() {
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
					}

					return true;
				}),
		];
	},

	validateActivation() {
		return [
			query("token")
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
	},

	validatePasswordChangeRequest() {
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

					if (!user) {
						throw new Error("The given email address is not registered");
					}

					return true;
				}),
		];
	},

	validateChangePassword() {
		return [
			query("id")
				.trim()

				.custom(async value => {
					const _id = value;

					// check if the _id is a valid ObjectId
					if (_id.match(/^[0-9a-fA-F]{24}$/)) {
						const user = await User.findOne({ _id }).lean().exec();

						if (!user) {
							throw new Error("User not found");
						}
					} else {
						throw new Error("Invalid id");
					}

					return true;
				}),

			query("token").trim(),

			body("password")
				.trim()

				.isLength({ min: 8, max: 32 })
				.withMessage("The password must be between 8 and 32 characters long"),
		];
	},
};

export default userValidator;
