import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import dotenv from "dotenv"

dotenv.config()

export const arcjetProtection = async(req, res, next) => {
    try {
        const decision = await aj.protect(req);
        if (process.env.ARCJET_ENV != "development"){

            if(decision.isDenied()){
                if (decision.reason.isRateLimit()){
                    return res.status(429).json({message: "Rate limit exceeded. Please try again later."})
                }else if (decision.reason.isBot()){
                    return res.status(403).json({message: "Bot access denied"})
                }
                else {
                    return res.status(403).json({
                        message:"Acess denied by security policy"
                    })
                }
            }
    
            if (decision.results.some(isSpoofedBot)) {
                return res.status(403).json({
                    error: "Spoofed bot detected",
                    message: "Malicious bot activity detected",
                });
            }
        }
        next();
    } catch (error) {
        console.log("Arcjet Protection Error:", error);
        next()
    }
}