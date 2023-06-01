import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env["SENDGRID_API_KEY"] as string);

export const transport = sgMail;
export const sender = process.env["SENDGRID_SENDER"] as string;
