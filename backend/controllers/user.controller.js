import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from '../models/user.model.js';
import jwt, { decode } from 'jsonwebtoken';

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, businessName, phoneNo, address } = req.body;
    if ([name, email, password, businessName, phoneNo, address ].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    const user = await User.create({
        name,
        email,
        password,
        businessName,
        phoneNo,
        address 
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken',options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
    incomingRequestToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRequestToken){
        throw new ApiError(400,"Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(incomingRequestToken,process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(400,"Invalid Refresh Token")
        }

        if(incomingRequestToken !== user?.refreshToken){
            throw new ApiError(400,"Refresh token is expired or used")
        }

        const {accessToken, newRefreshToken} = generateAccessRefreshToken(user._id)

        const options = {
            httpOnly:true,
            secure:true
        }

        return res
        .status(200)
        .clearCookie("accessToken",accessToken,options)
        .clearCookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{accessToken, refreshToken:newRefreshToken}, "AccessToken refreshed Successfull"))
    } catch (error) {
        throw new ApiError(400,error.message || "error while refreshing token")
    }
});

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:true});
    
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfull"))
});

const getCurrentUserDetails = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user?._id).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"User details fetched Successful"))
});

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {name, email, businessName, phoneNo, address} = req.body
    if(!name || !email || !businessName){
        throw new ApiError(400,"All field are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                name,
                email,
                businessName,
                phoneNo,
                address
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successful"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getCurrentUserDetails,
    updateAccountDetails,
};  