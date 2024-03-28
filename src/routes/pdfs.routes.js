import { Router } from "express";
import { getpdfdata, uploadPDF } from "../controllers/pdf.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


//secured routes

router.route("/uploadpdf").post(upload.single('pdfFile'),verifyJWT,uploadPDF)
router.route("/getpdfdata").get(getpdfdata)


export default router;