import { body, cookie } from "express-validator";

const emailValidator = () =>
	body("email")
		.notEmpty()
		.withMessage("The email address must not be empty")

		.isEmail()
		.withMessage("Invalid email address");

const cookieValidator = () =>
	cookie("jwt") //
		.trim()

		.notEmpty()
		.withMessage("Unauthorized");

const passwordValidator = () =>
	body("password")
		.trim()

		.notEmpty()
		.withMessage("The email address must not be empty")

		.isLength({ min: 12, max: 256 })
		.withMessage("The password must be at least 12 characters long");

export { emailValidator, passwordValidator, cookieValidator };
