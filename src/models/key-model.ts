import { Schema, model } from "mongoose";

const keySchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		password: {
			value: {
				type: String,
				required: true,
			},
			iv: {
				type: String,
				required: true,
			},
		},
		title: {
			type: String,
			required: true,
		},
		customFields: [
			{
				type: Object,
			},
		],
	},
	{ versionKey: false }
);

const keyModel = model("Key", keySchema);

export default keyModel;
