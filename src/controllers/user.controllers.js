import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/users.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        // console.log(accessToken,refreshToken)

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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
    const existedUser = await User.findOne({
        $or:[{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already existed")
    }

    //4. store images
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

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
        avatar: avatar.url,
        coverImage: coverImage?.url||"",
        email,
        password,
        username: username.toLowerCase(),
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


const loginUser = asyncHandler( async(req,res)=>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    //1. data
    const {username,email,password}=req.body;

    //2. check username or email
    if( !(username || email) ){
        throw new ApiError(401,"username or email is required")
    }

    //3. find user
    const user = await User.findOne({
        $or:[{username},{email}]
    })

    //4. check user
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    //5. check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    
    //6. genrate ascces and refresh token
    const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user._id)
    

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //options is make the cookie editatble only to the server
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})
export{
    registerUser,
    loginUser,
    logoutUser
};

