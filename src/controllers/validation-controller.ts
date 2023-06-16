import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";

import Controller from "@interfaces/controller-interface";
import userModel from "@models/user-model";
import ValidationRoutes from "@routes/validation-routes";

export default class ValidationController implements Controller {
	public router: Router;

	private user;
	private validationRoutes;

	constructor() {
		this.validationRoutes = new ValidationRoutes(this);
		this.router = this.validationRoutes.router;
		this.user = userModel;
	}

	/*
		method: POST
		route: /api/validate/login/email
		access: Public
	*/
	public validateLoginEmail = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;

			const foundUser = await this.user.findOne({ email }).lean().exec();

			if (!foundUser) {
				return res
					.status(404) // the endpoint is valid but the resource itself does not exist
					.json({ message: "No account found with the given email address" });
			} else if (!foundUser.active) {
				return res
					.status(403) // the client's identity is known to the server, but has no access rights to the content
					.json({ message: "Account is not activated" });
			}

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/validate/login/password
		access: Public
	*/
	public validateLoginPassword = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			const foundUser = await this.user.findOne({ email }).lean().exec();

			if (foundUser) {
				const arePasswordsEqual = await bcrypt.compare(password, foundUser.password);

				if (!arePasswordsEqual) {
					return res
						.status(401) // the authorization has been refused for the given credentials
						.json({ message: "Incorrect password" });
				}
			}

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/validate/register/email
		access: Public
	*/
	public validateRegisterEmail = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;

			const foundUser = await this.user.findOne({ email }).lean().exec();

			if (foundUser) {
				return res
					.status(409) // the request conflicts with the current state of the server
					.json({ message: "The given email address is already in use" });
			}

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}
