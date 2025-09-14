import { resendClient, sender } from "../lib/resend.js";
import { welcomeEmailTemplate } from "./templates/welcomeEmail.js";

export const sendWelcomeEmail = async(email, name) =>{
    const {data, error} = await resendClient.emails.send({
        from:`${sender.name} <${sender.email}>`,
        to:email,
        subject: "Welcome to the Realtime Chat App",
        html: welcomeEmailTemplate(name)
    })
    if (error){
        throw new Error("Failed Sending Email");
    }
    console.log("Email sent Successfully")
}