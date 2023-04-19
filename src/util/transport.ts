import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
	host: process.env["TRANSPORT_HOST"],
	port: Number(process.env["TRANSPORT_PORT"]),
	auth: {
		user: process.env["TRANSPORT_AUTH_USER"],
		pass: process.env["TRANSPORT_AUTH_PASS"],
	},
});

export default transport;
