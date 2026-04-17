import { Router } from "express";
import { verifyJwtToken } from "../Middlewares/Auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import { getMyProfile, updateMyProfile } from "../Controllers/Profile.controller.js";

const router = Router();

router.route("/getMyProfile").get(verifyJwtToken,getMyProfile);
router.route("/updateProfile").put(verifyJwtToken,upload.single("profilePicture"),updateMyProfile);

export default router;