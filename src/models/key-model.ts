import { Schema, model } from "mongoose";

const keySchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		username: {
			type: String,
		},
		email: {
			type: String,
		},
		websiteUrl: {
			type: String,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false }
);

const keyModel = model("Key", keySchema);

export default keyModel;
