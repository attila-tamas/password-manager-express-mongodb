const express = require("express");
const { registerUser, loginUser, logoutUser, getCurrentUser } = require("../controllers/authenticationController");

const router = express.Router();

router.post("/api/user/register", registerUser);
router.post("/api/user/login", loginUser);
router.get("/api/user/logout", logoutUser);
router.get("/api/user/current", getCurrentUser);

module.exports = router;
