import jwt from "jsonwebtoken";
import User from "../modals/user.modal.js";
import dotenv from "dotenv";

dotenv.config();

export const ProtectedRoute = async(req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message:"Unauthorized - No token found"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message:"Unauthorized - Invalid token"});

        const user = await User.findById(decoded.userId);
        if(!user) return res.status(404).json({message: "User not found"});
        req.user = user
        next();
    } catch (error) {
        
    }
}