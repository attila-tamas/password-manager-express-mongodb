require("dotenv").config();

const express = require("express");

const app = express();

// routes
app.get("/", (req, res) => {
	res.json({ message: "Welcome" });
});

app.listen(process.env.PORT, () => {
	console.log("The backend server is listening on port", process.env.PORT);
});
