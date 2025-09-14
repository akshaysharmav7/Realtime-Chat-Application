import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

export const resendClient = new Resend(process.env.RESEND_API_KEY);

export const sender = {
    email: process.env.RESEND_EMAIL,
    name: process.env.RESEND_NAME
}