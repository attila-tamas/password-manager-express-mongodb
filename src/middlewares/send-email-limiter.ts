import { rateLimit } from "express-rate-limit";

const limitVerificationEmailRequests = rateLimit({
	windowMs: 30 * 1000, // 30 seconds
	max: 1,
	handler: (_req, res) => {
		return res.status(400).json({
			message: `Too many verification email requests. Try again later.`,
		});
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export default limitVerificationEmailRequests;
