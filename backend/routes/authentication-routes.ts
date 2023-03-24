import express from "express";

import {
	validateRegistration,
	validateLogin,
	validateSession,
} from "../middlewares/validation/validation-schemas";

import validateRequest from "../middlewares/validation/validate-request";

import {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
} from "../controllers/authentication-controller";

const router = express.Router();

router.post("/api/user/register", validateRegistration, validateRequest, registerUser);
router.post("/api/user/login", validateLogin, validateRequest, loginUser);
router.get("/api/user/logout", validateSession, validateRequest, logoutUser);
router.get("/api/user/current", validateSession, validateRequest, getCurrentUser);

export default router;
