import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getUserForSidebar,getMessages,sendMessage} from "../controllers/message.controller.js"
const router= express.Router();

// This is for the user to show to which we can chat
router.get("/user",protectRoute,getUserForSidebar);

// this is for the chat message of the user to which we are chatting
router.get("/:id",protectRoute,getMessages)

// this is for the sending message to the user 
router.post("/send/:id",protectRoute,sendMessage);
export default router;