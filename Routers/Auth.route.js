import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { registeruser , loginUser , getAllUsers } from "../Controllers/User.controller.js";

const router = Router();

router.route("/registerUser").post(registeruser);
router.route("/loginUser").post(loginUser);
router.route("/getAllUsers").get(verifyJwtToken,getAllUsers);

export default router;                              