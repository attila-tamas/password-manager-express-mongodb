import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import "dotenv/config";

import { sender, transport } from "@config/mailService";
import AccountActivationEmailTemplate from "@templates/accountActivationEmailTemplate";

import Controller from "@interfaces/controller.interface";
import userModel from "@models/user.model";
import AuthenticationRoutes from "@routes/authentication.route";

export default class AuthenticationController implements Controller {
	public router;

	private user;
	private authRoutes;
	private transport;

	constructor() {
		this.authRoutes = new AuthenticationRoutes(this);
		this.router = this.authRoutes.router;
		this.user = userModel;
		this.transport = transport;
	}

	/*
		method: POST
		route: /api/auth/register
		access: Public
	*/
	public registerUser = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;
			const password = await bcrypt.hash(req.body.password, 10);
			const activatorToken = uuidv4();

			const createdUser = await this.user.create({
				email,
				password,
				activatorToken,
			});

			await this.transport.send({
				to: email,
				from: sender,
				subject: "Account activation",
				html: AccountActivationEmailTemplate(createdUser.activatorToken),
			});

			return res.sendStatus(201);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: POST
		route: /api/auth/login
		access: Public
	*/
	public loginUser = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;

			const user = await this.user.findOne({ email }).exec();

			const accessToken = jwt.sign(
				{
					UserInfo: {
						id: user?._id,
						email: user?.email,
					},
				},
				process.env["ACCESS_TOKEN_SECRET"] as string,
				{ expiresIn: "10m" }
			);

			const refreshToken = jwt.sign(
				{ email: user?.email },
				process.env["REFRESH_TOKEN_SECRET"] as string,
				{ expiresIn: "1d" }
			);

			// create cookie
			res.cookie("jwt", refreshToken, {
				httpOnly: true,
				// secure: true,
				sameSite: "none",
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			});

			return res.status(200).json({ accessToken });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method POST
		route: /api/auth/logout
		access: Public
	*/
	public logoutUser = async (_req: Request, res: Response) => {
		try {
			res.clearCookie("jwt", {
				httpOnly: true,
				// secure: true,
				sameSite: "none",
			});

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: GET
		route: /api/auth/refresh
		access: Public
	*/
	public refreshToken = async (req: Request, res: Response): Promise<any> => {
		try {
			const cookies = req.cookies;
			const refreshToken = cookies.jwt;

			jwt.verify(
				refreshToken,
				process.env["REFRESH_TOKEN_SECRET"] as string,
				async (error: any, decoded: any) => {
					if (error) {
						return res.status(403).json({ message: "Forbidden" });
					}

					const user = await this.user.findOne({ email: decoded.email }).exec();

					if (!user) {
						return res.status(401).json({ message: "Unauthorized" });
					}

					const accessToken = jwt.sign(
						{
							UserInfo: {
								id: user._id,
								email: user.email,
							},
						},
						process.env["ACCESS_TOKEN_SECRET"] as string,
						{ expiresIn: "10m" }
					);

					return res.status(200).json({ accessToken });
				}
			);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}
