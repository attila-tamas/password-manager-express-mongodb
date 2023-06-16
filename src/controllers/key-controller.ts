import { Request, Response } from "express";
import { matchedData } from "express-validator";

import { decrypt, encrypt } from "@util/encryption-handler";

import Controller from "@interfaces/controller-interface";
import keyModel from "@models/key-model";
import KeyRoutes from "@routes/key-routes";

export default class KeyController implements Controller {
	public router: any;

	private key;
	private keyRoutes;

	constructor() {
		this.keyRoutes = new KeyRoutes(this);
		this.router = this.keyRoutes.router;
		this.key = keyModel;
	}

	/*
		method: POST
		route: /api/key/new
		access: Protected
	*/
	public CreateNewKey = async (req: Request, res: Response) => {
		try {
			const { password, title, customFields } = req.body;
			const encryptedPassword = encrypt(password);

			await this.key.create({
				userId: (<any>req).user.id,
				password: {
					value: encryptedPassword.value,
					iv: encryptedPassword.iv,
				},
				title,
				customFields: [...customFields],
			});

			return res.sendStatus(201);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: GET
		route: /api/key?keyword=...&page=...&sort=...&asc=...
		access: Protected

		on "/api/key" route it defaults to { keyword: '', page: '1', limit: 10, sort: 'title', asc: 1 }
		on default it returns the first 10 keys, sorted by the title, in ascending order
	*/
	public GetPaginatedKeysByKeyword = async (req: Request, res: Response) => {
		try {
			const filterRegex = new RegExp(req.query["keyword"] as string, "i");
			const { page, limit, sort, asc } = matchedData(req);
			const previousData = (page - 1) * limit;

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
				.sort({ [sort]: asc })
				.skip(previousData)
				.limit(limit)
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

	/*
		method: PATCH
		route: /api/key/update
		access: Protected
	*/
	public UpdateKey = async (req: Request, res: Response) => {
		try {
			const { id, password, title, customFields } = req.body;
			const encryptedPassword = encrypt(password);

			const updatedData = {
				password: {
					value: encryptedPassword.value,
					iv: encryptedPassword.iv,
				},
				title,
				customFields,
			};

			await this.key.findByIdAndUpdate({ _id: id }, updatedData, { new: true }).exec();

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: DELETE
		route: /api/key/delete
		access: Protected
	*/
	public DeleteKey = async (req: Request, res: Response) => {
		try {
			const id = req.body.id;

			await this.key.findByIdAndDelete(id).exec();

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};

	/*
		method: DELETE
		route: /api/key/delete/all
		access: Protected
	*/
	public DeleteAllKeysByUserId = async (req: Request, res: Response) => {
		try {
			await this.key.deleteMany({ userId: (<any>req).user.id }).exec();

			return res.sendStatus(204);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
	};
}
