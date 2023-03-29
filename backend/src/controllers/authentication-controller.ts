import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import "dotenv/config";

import userModel from "../models/user-model";
import Controller from "../interfaces/controller-interface";
import AuthenticationRoutes from "../routes/authentication-routes";

export default class AuthenticationController implements Controller {
	public router;

	private user;
	private authRoutes;
	private transport;

	constructor() {
		this.authRoutes = new AuthenticationRoutes(this);
		this.router = this.authRoutes.router;

		this.user = userModel;

		this.transport = nodemailer.createTransport({
			host: process.env["TRANSPORT_HOST"],
			port: Number(process.env["TRANSPORT_PORT"]),
			auth: {
				user: process.env["TRANSPORT_AUTH_USER"],
				pass: process.env["TRANSPORT_AUTH_PASS"],
			},
		});
	}

	public registerUser = async (req: Request, res: Response) => {
		try {
			const { username, email } = req.body;
			const password = await bcrypt.hash(req.body.password, 10);
			const activatorToken = uuidv4();

			const createdUser = await this.user.create({
				username,
				email,
				password,
				activatorToken,
			});

			await this.transport
				.sendMail({
					from: "address@example.com",
					to: email,
					subject: "Account activation",
					html: `
					<h3>Account activation</h3>
					<p>
						Click on this link to activate your account: http://localhost:5000/api/user/activate/${createdUser.activatorToken}
					</p>`,
				})
				.then(message => {
					console.log(
						"View account activation email: %s",
						nodemailer.getTestMessageUrl(message)
					);
				});

			return res.status(200).json(createdUser);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	public activateUser = async (req: Request, res: Response) => {
		try {
			const activatorToken = req.params["activatorToken"];

			await this.user.updateOne({ activatorToken }, { $unset: { activatorToken } });

			return res.status(200).json({ message: "Account successfully activated" });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	public loginUser = async (req: Request, res: Response) => {
		try {
			const username = req.body.username;
			const session = uuidv4(); // generate a session id

			res.cookie("SESSION_ID", session);

			const user = await this.user.findOneAndUpdate(
				{ username },
				{ $set: { session } },
				{ new: true }
			);

			return res.status(200).json(user);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	public logoutUser = async (req: Request, res: Response) => {
		try {
			const session = req.cookies["SESSION_ID"];

			await this.user.updateOne({ session }, { $unset: { session } });

			res.clearCookie("SESSION_ID");

			return res.status(200).json({ message: "User successfully logged out" });
		} catch (error: any) {
			return res.status(500).json({ error: error.message });
		}
	};

	public getCurrentUser = async (req: Request, res: Response) => {
		try {
			const session = req.cookies["SESSION_ID"];

			const user = await this.user.findOne({ session });

			return res.status(200).json(user);
		} catch (error: any) {
			return res.status(500).json({ error: error.message });
		}
	};
}
