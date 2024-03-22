import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import { User } from "../models/users.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async(req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    //1. get user data
    const {fullName,email,password,username} = req.body

    //2. validation is feild is empty or not
    if([fullName,email,password,username].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    //3. user exist or not
    const existedUser = User.findOne({
        $or:[{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already existed")
    }

    //4. store images
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    //5. check images 
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    //6. upload on coluinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //7. check on couldnariy 
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    //8. create user 
    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url||""
    })

    // 9. now to verify user is created of not
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // check the user is created 
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the User")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully ")
    )



})

export{registerUser};

