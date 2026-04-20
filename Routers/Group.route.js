import { Router } from "express";
import { createGroup , getGroups  , getGroupMessages} from "../Controllers/Group.controller.js";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";

const router = Router();

router.route("/createGroup").post(verifyJwtToken,createGroup);
router.route("/getGroups").get(verifyJwtToken,getGroups);
router.route("/getGroupMessages/:groupId").get(verifyJwtToken,getGroupMessages);

export default router;