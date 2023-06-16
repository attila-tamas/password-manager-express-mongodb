import { rateLimit } from "express-rate-limit";

/*
	windowMs: Time frame for which requests are checked/remembered
	max: The maximum number of connections to allow during the window before rate limiting the client
*/

const loginLimiter = rateLimit({
	windowMs: 10 * 1000, // 10s
	max: 5,
	handler: (_req, res) => {
		return res.status(429).json({
			message: `Too many sign-in attempts. Try again after 10 seconds.`,
		});
	},
	standardHeaders: true,
	legacyHeaders: false,
});

const sendVerificationEmailLimiter = rateLimit({
	windowMs: 30 * 1000, // 30s
	max: 1,
	handler: (_req, res) => {
		return res.status(429).json({
			message: `Too many verification email requests. Try again after 30 seconds.`,
		});
	},
	standardHeaders: true,
	legacyHeaders: false,
});

export { loginLimiter, sendVerificationEmailLimiter };
