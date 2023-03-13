require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// middlewares
app.use(express.json());

// routes
const authenticationRoutes = require("./routes/authenticationRoutes");

app.use(authenticationRoutes);

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
