import express from "express";
import { getAllContacts, getChatPartners, getMessageByUserId, sendMessage } from "../controllers/message.controller.js";
import { ProtectedRoute } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection, ProtectedRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners );
router.get("/:id", getMessageByUserId);
router.post("/send/:id", sendMessage );

export default router;