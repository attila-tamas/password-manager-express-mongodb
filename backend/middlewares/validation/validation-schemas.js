const User = require("../../models/user-model");
const { body, cookie } = require("express-validator");
const bcrypt = require("bcrypt");

const validateRegistration = [
	body("username")
		.trim()

		.isLength({ min: 2, max: 8 })
		.withMessage("The username must be between 2 and 8 characters long")

		.custom(async value => {
			const username = value;

			const user = await User.findOne({
				username,
			});
			if (user) {
				throw new Error("The given username is already in use");
			}

			return true;
		}),

	body("email")
		.normalizeEmail()

		.notEmpty()
		.withMessage("The email address must not be empty")

		.isEmail()
		.withMessage("Invalid email address")

		.custom(async value => {
			const email = value;

			const user = await User.findOne({
				email,
			});
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

const validateLogin = [
	body("username")
		.trim()

		.notEmpty()
		.withMessage("The username must not be empty")

		.custom(async value => {
			const username = value;

			const user = await User.findOne({
				username,
			});
			if (!user) {
				throw new Error("No account found with the given username");
			}

			return true;
		}),

	body("password")
		.trim()

		.notEmpty()
		.withMessage("The password must not be empty")

		.custom(async (value, { req }) => {
			const username = req.body.username;
			const user = await User.findOne({
				username,
			});

			const arePasswordsEqual = await bcrypt.compare(value, user.password);
			if (!arePasswordsEqual) {
				throw new Error("Incorrect password");
			}

			return true;
		}),
];

const validateSession = [
	cookie("SESSION_ID")
		.notEmpty()
		.withMessage("The requested session does not exist")

		.custom(async value => {
			const session = value;

			const user = await User.findOne({
				session,
			});
			if (!user) {
				throw new Error("No user found with the given session id");
			}

			return true;
		}),
];

module.exports = {
	validateRegistration,
	validateLogin,
	validateSession,
};
