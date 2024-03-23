import { Router } from "express";
import { loginUser, logoutUser, registerUser ,refreshAccessToken } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { verify } from "jsonwebtoken";


const router = Router();


router.route("/register").post(
    upload.fields([
    {
        name: "avatar",
        maxCount : 1
    },
    {
        name: "coverImage",
        maxCount : 1
    }
]),registerUser
)

router.route("/login").post(loginUser)
//secured routs
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


export default router;