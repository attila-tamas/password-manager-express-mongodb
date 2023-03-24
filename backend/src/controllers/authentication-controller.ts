import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import userModel from "../models/user-model";
import Controller from "../interfaces/controller-interface";
import AuthenticationValidator from "../middlewares/validation/authentication-validator";
import validateRequest from "../middlewares/validation/request-validator";

export default class AuthenticationController implements Controller {
	public readonly router = Router();
	private user = userModel;
	private authValidator = new AuthenticationValidator();

	constructor() {
		this.router.post(
			"/api/user/register",
			this.authValidator.validateRegistration,
			validateRequest,
			this.registerUser
		);

		this.router.post(
			"/api/user/login",
			this.authValidator.validateLogin,
			validateRequest,
			this.loginUser
		);

		this.router.get(
			"/api/user/logout",
			this.authValidator.validateSession,
			validateRequest,
			this.logoutUser
		);

		this.router.get(
			"/api/user/current",
			this.authValidator.validateSession,
			validateRequest,
			this.getCurrentUser
		);
	}

	public registerUser = async (req: Request, res: Response) => {
		try {
			const { username, email } = req.body;
			const password = await bcrypt.hash(req.body.password, 10);

			const createdUser = await this.user.create({
				username,
				email,
				password,
			});

			return res.status(200).json(createdUser);
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
