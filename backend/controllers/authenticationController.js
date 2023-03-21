const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const sessionKey = "SESSION_ID";

const registerUser = async (req, res) => {
	try {
		if (req.body.email && req.body.password) {
			const email = req.body.email;
			const user = await User.findOne({ email });
			if (!user) {
				const password = await bcrypt.hash(req.body.password, 10);
				const createdUser = await User.create({
					email,
					password,
				});
				return res.status(200).json(createdUser);
			} else {
				return res.status(400).json({ error: "The given email address is already in use" });
			}
		} else {
			return res.status(400).json({ error: "Incorrect input" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const loginUser = async (req, res) => {
	try {
		if (req.body.email && req.body.password) {
			const email = req.body.email;
			const user = await User.findOne({ email });
			if (user) {
				const arePasswordsEqual = await bcrypt.compare(req.body.password, user.password);
				if (arePasswordsEqual) {
					const session = uuid.v4(); // generate a session id
					res.cookie(sessionKey, session);
					await User.updateOne({ email }, { $set: { session } }).then(() => {
						return res.status(200).json(user);
					});
				} else {
					return res.status(400).json({ error: "Incorrect password" });
				}
			} else {
				return res.status(400).json({ error: "No account found with the given email address" });
			}
		} else {
			return res.status(400).json({ error: "Incorrect input" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const logoutUser = async (req, res) => {
	try {
		const session = req.cookies[sessionKey];
		if (session) {
			const user = await User.findOne({ session });
			if (user) {
				await User.updateOne({ session }, { $unset: { session } }).then(() => {
					res.clearCookie(sessionKey);
					return res.status(200).json({ message: "User successfully logged out" });
				});
			} else {
				return res.status(400).json({ error: "No user found with the given session id" });
			}
		} else {
			return res.status(400).json({ error: "The requested session does not exist" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const getCurrentUser = async (req, res) => {
	try {
		const session = req.cookies[sessionKey];
		if (session) {
			const user = await User.findOne({ session });
			if (user) {
				return res.status(200).json(user);
			} else {
				return res.status(400).json({ error: "No user found with the given session id" });
			}
		} else {
			return res.status(400).json({ error: "The requested session does not exist" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
};
