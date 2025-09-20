import express from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { ProtectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();
//middle ware to call this function before the controller in every api
// router.use(arcjetProtection)  

router.post("/signup", signup)
router.post("/login", login)

router.get("/logout", logout)

router.put("/update-profile", ProtectedRoute, updateProfile);

router.get("/check", ProtectedRoute, (req, res) => res.status(200).json(req.user));

// router.get("/arcjet-test", arcjetProtection, (req,res)=>{res.send("Testing Arcjet")})

export default router;