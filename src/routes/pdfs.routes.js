import { Router } from "express";
import { uploadPDF } from "../controllers/pdf.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

/*router.route("/uploadpdf").post(upload.single({
    name:"pdfFile",
    maxcount:1
}),verifyJWT,uploadPDF)*/
router.route("/uploadpdf").post(upload.single('pdfFile'),verifyJWT,uploadPDF)


export default router;