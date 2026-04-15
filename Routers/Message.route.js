import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { getMessages } from "../Controllers/Message.controller.js";

const router = Router();

router.route("/getMessages/:senderId/:receiverId").get(verifyJwtToken,getMessages);

export default router;