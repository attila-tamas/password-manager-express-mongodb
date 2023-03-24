import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		session: String,
	},
	{ versionKey: false }
);

const userModel = model("User", userSchema);

export default userModel;
