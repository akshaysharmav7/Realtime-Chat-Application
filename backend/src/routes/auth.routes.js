import express from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { ProtectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.get("/logout", logout)

router.put("/update-profile", ProtectedRoute, updateProfile);

export default router;