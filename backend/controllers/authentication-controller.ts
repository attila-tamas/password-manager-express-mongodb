import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import User from "../models/user-model";

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { username, email } = req.body;
		const password = await bcrypt.hash(req.body.password, 10);

		const createdUser = await User.create({
			username,
			email,
			password,
		});

		return res.status(200).json(createdUser);
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const username = req.body.username;
		const session = uuidv4(); // generate a session id

		res.cookie("SESSION_ID", session);

		const user = await User.findOneAndUpdate(
			{ username },
			{ $set: { session } },
			{ new: true }
		);

		return res.status(200).json(user);
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}
};

export const logoutUser = async (req: Request, res: Response) => {
	try {
		const session = req.cookies["SESSION_ID"];

		await User.updateOne({ session }, { $unset: { session } });

		res.clearCookie("SESSION_ID");

		return res.status(200).json({ message: "User successfully logged out" });
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
};

export const getCurrentUser = async (req: Request, res: Response) => {
	try {
		const session = req.cookies["SESSION_ID"];

		const user = await User.findOne({ session });

		return res.status(200).json(user);
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
};
