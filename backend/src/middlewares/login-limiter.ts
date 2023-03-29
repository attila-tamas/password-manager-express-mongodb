import { rateLimit } from "express-rate-limit";

const limitLoginAttempts = rateLimit({
	windowMs: 30 * 1000, // 30 seconds
	max: 5,
	handler: (_req, res) => {
		return res.status(400).json({
			message: `Too many sign-in attempts. Try again later.`,
		});
	},
});

export default limitLoginAttempts;
