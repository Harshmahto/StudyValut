import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Pdf } from "../models/pdf.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadPDF = asyncHandler(async(req,res)=>{

    // while creating the route use both middleware first - multer , second - auth

    // get username form frontend this come from middleware req.user
    // validate the username
    // now owner = username
    // get pdfName , subject , semester , categories , pyqYear from frontend from req.body
    // validate the above details
    // get the pdf local path  from multer middleware & check
    // upload on cloudinary & check
    // store the pdf link on pdfFile = pdfFile.url
    // create the pdf document using .create 
    

    // 1. username
    const {username} = req.user;

    // check the username
    if(!username){
        throw new ApiError(400,"Your are not loggedin")
    }

    // 2. owner = username
    // const owner = username;

    // 3. get the other details
    const { pdfName , subject , semester , categories , pyqYear} = req.body // send pyqYear = zero if pyqYEar is empty from frontend

    // check
    if([pdfName , subject , semester , categories].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    //handel pyqYear
    if(pyqYear===""){
        pyqYear=0;
    }

    // 4. pdflocalpath
    // console.log(req.file.path)
    const pdfLocalfilePath =  req.file.path
    
    //check
    if(!pdfLocalfilePath){
        throw new ApiError(400,"pdf file is required")
    }

    // 5. upload on cloudinary
    const pdfFile = await uploadOnCloudinary(pdfLocalfilePath)
    //check
    if(!pdfFile){
        throw new ApiError(400,"pdf file is required")
    }

    //6. create the document 
    const pdf = await Pdf.create({
        owner: username,
        pdfName,
        subject,
        semester,
        categories,
        pdfFile: pdfFile.url,
        pyqYear
    })

    //7.
    const createdPdf = await Pdf.findById(pdf._id)
    //check
    if(!createdPdf){
        throw new ApiError(500,"Something went wrong while uploding the pdf")
    }

    //8. response
    return res.status(201).json(
        new ApiResponse(200,createdPdf,"PDF uploded Successfully ")
    )





})





export {
    uploadPDF,
}