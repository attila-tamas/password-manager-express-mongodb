import { Request, Response } from "express";

import { decrypt, encrypt } from "../util/encryption-handler";

import Controller from "../interfaces/controller-interface";
import keyModel from "../models/key-model";
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
	// @access Protected
	public CreateNewKey = async (req: Request, res: Response) => {
		try {
			const { title, customFields } = req.body;
			const encryptedPassword = encrypt(req.body.password);

			const createdKey = await this.key.create({
				userId: (<any>req).user.id,
				password: {
					value: encryptedPassword.value,
					iv: encryptedPassword.iv,
				},
				title,
				customFields: [...customFields],
			});

			const responseData = {
				id: createdKey._id,
				password: decrypt({
					password: createdKey?.password?.value,
					iv: createdKey?.password?.iv,
				}),
				title: createdKey.title,
				customFields: createdKey.customFields,
			};

			return res.status(200).json(responseData);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// If there is no keyword, all keys will be returned
	// @route GET /api/key?keyword=
	// @access Protected
	public GetKeysByKeyword = async (req: Request, res: Response) => {
		try {
			const filterRegex = new RegExp(req.query["keyword"] as string, "i");

			const filteredKeys = await this.key
				.find({
					userId: (<any>req).user.id,
					$or: [
						{ title: filterRegex },
						{ username: filterRegex },
						{ email: filterRegex },
						{ websiteUrl: filterRegex },
					],
				})
				.exec();

			const responseData = filteredKeys.map((key: any) => {
				return {
					id: key._id,
					password: decrypt({ password: key.password.value, iv: key.password.iv }),
					title: key.title,
					customFields: key.customFields,
				};
			});

			return res.status(200).json(responseData);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route PATCH /api/key/update
	// @access Protected
	public UpdateKey = async (req: Request, res: Response) => {
		try {
			const { id, title, customFields } = req.body;
			const encryptedPassword = encrypt(req.body.password);

			const updatedData = {
				password: {
					value: encryptedPassword.value,
					iv: encryptedPassword.iv,
				},
				title,
				customFields,
			};

			const updatedKey = await this.key
				.findByIdAndUpdate({ _id: id }, updatedData, { new: true })
				.exec();

			const responseData = {
				id: updatedKey?._id,
				password: updatedKey?.password?.value,
				title: updatedKey?.title,
				customFields: updatedKey?.customFields,
			};

			return res.status(200).json(responseData);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route DELETE /api/key/delete
	// @access Protected
	public DeleteKey = async (req: Request, res: Response) => {
		try {
			const id = req.body.id;

			const deletedKey = await this.key.findByIdAndDelete(id).exec();

			return res.status(200).json({ message: `${deletedKey?.title} deleted` });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	// @route DELETE /api/key/delete/all
	// @access Protected
	public DeleteAllKeysByUserId = async (req: Request, res: Response) => {
		try {
			await this.key.deleteMany({ userId: (<any>req).user.id }).exec();

			return res.status(200).json({ message: `All keys deleted` });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}
