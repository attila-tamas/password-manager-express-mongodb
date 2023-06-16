import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import mongoose from "mongoose";

import "dotenv/config";

import corsOptions from "./config/cors-options";
import IController from "./interfaces/controller-interface";

export default class App {
	private app: Application;

	constructor(controllers: IController[]) {
		this.app = express();

		this.setMiddlewares();

		this.setRoutes(controllers);

		this.connectToTheDatabase();
	}

	private setMiddlewares() {
		this.app.use(express.json());
		this.app.use(cookieParser());
		this.app.use(cors(corsOptions));
	}

	private setRoutes(controllers: IController[]) {
		controllers.forEach(controller => {
			this.app.use("/", controller.router);
		});
	}

	private connectToTheDatabase() {
		mongoose
			.connect(`${process.env["MONGO_URI"]}`)

			.then(() => {
				this.listen(process.env["BACKEND_PORT"]);
			})

			.catch(error => {
				console.log(error);
			});
	}

	private listen(port: string | undefined) {
		if (!port) {
			throw new Error("Backend port is undefined");
		} else {
			this.app.listen(port, () => {
				console.log("The backend server is listening on port", port);
			});
		}
	}
}
