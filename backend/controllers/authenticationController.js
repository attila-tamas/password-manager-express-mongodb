const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const sessionKey = "SESSION_ID";

const registerUser = async (req, res) => {
	try {
		if (req.body.email && req.body.password) {
			const email = req.body.email;

			User.findOne({ email })
				.then(async foundUser => {
					if (!foundUser) {
						const password = await bcrypt.hash(req.body.password, 10);

						User.create({
							email,
							password,
						})
							.then(savedUser => {
								return res.json(savedUser);
							})
							.catch(error => {
								return res.json({ error: error.message });
							});
					} else {
						return res.status(400).json({ error: "The given email address is already in use" });
					}
				})
				.catch(error => {
					return res.json({ error: error.message });
				});
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

			User.findOne({ email })
				.then(async foundUser => {
					if (foundUser) {
						const arePasswordsEqual = await bcrypt.compare(req.body.password, foundUser.password);

						if (arePasswordsEqual) {
							const session = uuid.v4(); // generate a session id

							res.cookie(sessionKey, session);

							User.updateOne({ email }, { $set: { session } })
								.then(() => console.log("User session successfully updated"))
								.catch(error => {
									console.log(error);
								});

							const userData = {
								email: foundUser.email,
								session,
								_id: foundUser._id,
							};

							return res.status(200).json(userData);
						} else {
							return res.status(400).json({ error: "Incorrect password" });
						}
					} else {
						return res.status(400).json({ error: "No account found with the given email address" });
					}
				})
				.catch(error => {
					return res.json({ error: error.message });
				});
		} else {
			return res.status(400).json({ error: "Incorrect input" });
		}
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const logoutUser = (req, res) => {
	try {
		const session = req.cookies[sessionKey];

		if (session) {
			User.findOne({ session })
				.then(foundUser => {
					if (foundUser) {
						User.updateOne({ session }, { $unset: { session } })
							.then(() => {
								res.clearCookie(sessionKey);
								return res.status(200).json({ message: "User successfully logged out" });
							})
							.catch(error => {
								return res.status(400).json({ error: error.message });
							});
					} else {
						return res.status(400).json({ error: "No user found with the given session id" });
					}
				})
				.catch(error => {
					return res.status(400).json({ error: error.message });
				});
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
};
