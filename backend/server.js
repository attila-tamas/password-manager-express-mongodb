require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// routes
app.get("/", (req, res) => {
	res.json({ message: "Welcome" });
});

// connect to the database
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(process.env.BACKEND_PORT, () => {
			console.log("The backend server is listening on port", process.env.BACKEND_PORT);
		});
	})
	.catch(error => {
		console.log(error);
	});
