import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import AccountActivationEmailTemplate from "@templates/account-activation-email";
import PasswordChangeRequestEmailTemplate from "@templates/password-change-request-email";
import { sender, transport } from "@util/transport";

import Controller from "@interfaces/controller-interface";
import keyModel from "@models/key-model";
import userModel from "@models/user-model";
import UserRoutes from "@routes/user-routes";
import { matchedData } from "express-validator";

export default class UserController implements Controller {
	public router: any;

	private user;
	private key;
	private userRoutes;
	private transport;

	constructor() {
		this.userRoutes = new UserRoutes(this);
		this.router = this.userRoutes.router;
		this.user = userModel;
		this.key = keyModel;
		this.transport = transport;
	}

	/*
		method: POST
		route: /api/auth/resend-verification-email
		access: Public
	*/
	public ResendVerificationEmail = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;
			const user = matchedData(req); // we are finding the user in the registration validator

			await this.transport.send({
				to: email,
				from: sender,
				subject: "Account activation",
				html: AccountActivationEmailTemplate(user?.["activatorToken"]),
			});

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/auth/activate
		access: Public
	*/
	public ActivateUser = async (req: Request, res: Response) => {
		try {
			const activatorToken = req.body.activatorToken;

			await this.user.updateOne(
				{ activatorToken },
				{ $unset: { activatorToken }, $set: { active: true } }
			);

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/user/request-password-change
		access: Public
	*/
	public RequestPasswordChange = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;
			const user = matchedData(req);

			const passwordChangeToken = jwt.sign(
				{
					UserInfo: {
						id: user?.["_id"],
						email: user?.["email"],
					},
				},
				(process.env["ACCESS_TOKEN_SECRET"] as string) + user?.["password"],
				{ expiresIn: "10m" }
			);

			await this.transport.send({
				to: email,
				from: sender,
				subject: "Password change request",
				html: PasswordChangeRequestEmailTemplate(user?.["_id"], passwordChangeToken),
			});

			return res.status(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/user/change-password
		access: Public
	*/
	public ChangePassword = async (req: Request, res: Response): Promise<any> => {
		try {
			const { email, token, password } = req.body;
			const newPassword = await bcrypt.hash(password, 10);
			const user = matchedData(req);

			jwt.verify(
				token as string,
				(process.env["ACCESS_TOKEN_SECRET"] as string) + user?.["password"],
				async (error: any) => {
					if (error) {
						return res.status(403).json({ message: "Forbidden" });
					}

					await this.user.updateOne({ email }, { $set: { password: newPassword } });

					return res.sendStatus(204);
				}
			);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: DELETE
		route: /api/user/delete
		access: Protected
	*/
	public DeleteUser = async (req: Request, res: Response) => {
		try {
			await this.user.findByIdAndDelete({ _id: (<any>req).user.id }).exec();

			await this.key.deleteMany({ userId: (<any>req).user.id }).exec();

			res.clearCookie("jwt", {
				httpOnly: true,
				// secure: true,
				sameSite: "none",
			});

			return res.status(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}
