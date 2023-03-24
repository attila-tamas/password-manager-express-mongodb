import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
import authenticationRoutes from "./routes/authentication-routes";

app.use(authenticationRoutes);

// connect to the database
mongoose
	.connect(`${process.env["MONGO_URI"]}`)
	.then(() => {
		app.listen(process.env["BACKEND_PORT"], () => {
			console.log("The backend server is listening on port", process.env["BACKEND_PORT"]);
		});
	})
	.catch(error => {
		console.log(error);
	});
