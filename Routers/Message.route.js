import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { getMessages ,  getUnreadCounts , markMessagesAsSeen } from "../Controllers/Message.controller.js";

const router = Router();

router.route("/getMessages/:senderId/:receiverId").get(verifyJwtToken,getMessages);
router.route("/unread/:userId").get(verifyJwtToken, getUnreadCounts);
router.route("/markSeen").post(verifyJwtToken, markMessagesAsSeen);

export default router;