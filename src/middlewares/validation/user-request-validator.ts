import User from "../../models/user-model";
import { body, param } from "express-validator";

export default class UserValidator {
	public readonly validatePasswordChangeRequest;
	public readonly validateChangePassword;

	constructor() {
		this.validatePasswordChangeRequest = this.getPasswordChangeRequestValidator();
		this.validateChangePassword = this.getChangePasswordValidator();
	}

	private getPasswordChangeRequestValidator() {
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
	}

	private getChangePasswordValidator() {
		return [
			param("id")
				.trim()

				.custom(async value => {
					const id = value;

					// check if the _id is a valid ObjectId
					if (id.match(/^[0-9a-fA-F]{24}$/)) {
						const user = await User.findOne({ _id: id }).lean().exec();

						if (!user) {
							throw new Error("User not found");
						}
					} else {
						throw new Error("Invalid id");
					}

					return true;
				}),

			param("token").trim(),

			body("password")
				.trim()

				.isLength({ min: 8, max: 32 })
				.withMessage("The password must be between 8 and 32 characters long"),
		];
	}
}
