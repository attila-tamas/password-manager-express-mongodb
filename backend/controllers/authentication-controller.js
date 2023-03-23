const User = require("../models/user-model");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
	try {
		const { username, email } = req.body;
		const password = await bcrypt.hash(req.body.password, 10);

		const createdUser = await User.create({
			username,
			email,
			password,
		});

		return res.status(200).json(createdUser);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const username = req.body.username;
		const session = uuid.v4(); // generate a session id

		res.cookie("SESSION_ID", session);

		const user = await User.findOneAndUpdate(
			{ username },
			{ $set: { session } },
			{ new: true }
		);

		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const logoutUser = async (req, res) => {
	try {
		const session = req.cookies["SESSION_ID"];

		await User.updateOne({ session }, { $unset: { session } }).then(() => {
			res.clearCookie("SESSION_ID");
			return res.status(200).json({ message: "User successfully logged out" });
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const getCurrentUser = async (req, res) => {
	try {
		const session = req.cookies["SESSION_ID"];

		const user = await User.findOne({ session });

		return res.status(200).json(user);
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
