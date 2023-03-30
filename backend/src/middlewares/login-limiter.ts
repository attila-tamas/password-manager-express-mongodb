import { rateLimit } from "express-rate-limit";

const limitLoginAttempts = rateLimit({
	windowMs: 10 * 1000, // 10 seconds
	max: 5,
	handler: (_req, res) => {
		return res.status(400).json({
			message: `Too many sign-in attempts. Try again later.`,
		});
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export default limitLoginAttempts;
