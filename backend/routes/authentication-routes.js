const express = require("express");

const {
	validateRegistration,
	validateLogin,
	validateSession,
} = require("../middlewares/validation/validation-schemas");

const { validateRequest } = require("../middlewares/validation/validate-request");

const {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
} = require("../controllers/authentication-controller");

const router = express.Router();

router.post("/api/user/register", validateRegistration, validateRequest, registerUser);
router.post("/api/user/login", validateLogin, validateRequest, loginUser);
router.get("/api/user/logout", validateSession, validateRequest, logoutUser);
router.get("/api/user/current", validateSession, validateRequest, getCurrentUser);

module.exports = router;
