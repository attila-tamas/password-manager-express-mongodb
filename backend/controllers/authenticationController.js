const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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

module.exports = {
	registerUser,
};
