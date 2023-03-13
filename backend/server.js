require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

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
