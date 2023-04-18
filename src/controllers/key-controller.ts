import { Request, Response } from "express";
import bcrypt from "bcrypt";

import keyModel from "../models/key-model";
import Controller from "../interfaces/controller-interface";
import KeyRoutes from "../routes/key-routes";

export default class KeyController implements Controller {
	public router: any;

	private key;
	private keyRoutes;

	constructor() {
		this.keyRoutes = new KeyRoutes(this);
		this.router = this.keyRoutes.router;

		this.key = keyModel;
	}

	// @route POST /api/key/new
	// @access Private
	public CreateNewKey = async (req: Request, res: Response) => {
		try {
			const { title, username, email, websiteUrl } = req.body;
			const password = await bcrypt.hash(req.body.password, 10);

			await this.key.create({
				userId: (<any>req).user.id,
				title,
				username,
				email,
				websiteUrl,
				password,
			});

			return res.status(200).json({ message: `New key created` });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route GET /api/key/all
	// @access Private
	public GetAllKeysByUserId = async (req: Request, res: Response) => {
		try {
			const keys = await this.key.find({ userId: (<any>req).user.id });

			return res.status(200).json(keys);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route GET /api/key/?keyword=
	// @access Private
	public GetKeysByKeyword = async (req: Request, res: Response) => {
		try {
			const filterRegex = new RegExp(req.query["keyword"] as string, "i");

			const filteredKeys = await this.key.find({
				userId: (<any>req).user.id,
				$or: [
					{ title: filterRegex },
					{ username: filterRegex },
					{ email: filterRegex },
					{ websiteUrl: filterRegex },
				],
			});

			return res.status(200).json(filteredKeys);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route PATCH /api/key/update/?id=
	// @access Private
	public UpdateKey = async (req: Request, res: Response) => {
		try {
			const id = req.query["id"];
			const body = req.body;

			const updatedKey = await this.key.findByIdAndUpdate(id, body, { new: true });

			return res.status(200).json(updatedKey);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route DELETE /api/key/delete/?id=
	// @access Private
	public DeleteKey = async (req: Request, res: Response) => {
		try {
			const id = req.query["id"];

			const deletedKey = await this.key.findByIdAndDelete(id);

			return res.status(200).json({ message: `Key with ID: ${deletedKey?._id} deleted` });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route DELETE /api/key/delete/all
	// @access Private
	public DeleteAllKeysByUserId = async (req: Request, res: Response) => {
		try {
			await this.key.deleteMany({ userId: (<any>req).user.id });

			return res.status(200).json({ message: `All keys deleted` });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}
