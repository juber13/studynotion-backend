import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

import {uploadImage , deleteImageOnCloudinary}  from "../utils/cloudinary.js";
import { sendMail , generateOtp } from "../utils/emailService.js";
import { configDotenv } from "dotenv";

const generateAccessAndRefreshToken = async(userId) => {
   try {
    const user = await User.findById(userId);  
    if(!user){
     throw new ApiError(401, "Invalid user Id");
    }

    const accessToken = user.generateAccessToken(userId); 
    const refreshToken =  user.generateRefreshToken(userId); 
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});
    return {accessToken}  
   } catch (error) {
     console.log(error);
     throw new ApiError(500, "Something went wrong while generating tokens" , error);
   }
}

// register user method post url[http://localhost:5000/user/register]
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword, role, lastName, phoneNumber } = req.body;
  const avatarLocalPath = req.file ? req.file.path : null; // Use req.file.path for the file path
   
   if(!name || !email || !password || !confirmPassword || !role || !lastName || !phoneNumber) { 
      return next(new ApiError(400, "All fields are required"));  
   }
    if(!avatarLocalPath) {
      return next(new ApiError(400, "Failed to upload avatar image"));
      // return.status()
    }

   if(password !== confirmPassword) {
     return next(new ApiError(400, "Password and confirm password must be same"));
   }
   
   const isUserExist = await User.findOne({email}); 
   
   if(isUserExist) {
     return next(new ApiError(400, "User already exist"));
   }

  let avatar = await uploadImage(avatarLocalPath);
  const newUser = await User.create({
    name,
    email,
    password,
    lastName,
    role,
    phoneNumber,
    imageUrl: avatar.url,
    imageId : avatar.public_id
  });

  return res.status(201).json(
    new ApiResponse(201, newUser, "User Registered Successfully")
  );
});


// login user method post url[http://localhost:5000/user/login]
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => !field)) 
    return next(new ApiError(400, "All fields are required"));

  let user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(401, "Invalid Password or Email"));
  }
  // Check if the password is valid
  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(new ApiError(401, "Invalid Password or Email"));  
  }
  // const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);
  const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);
  const loggedInUser  = await User.findById(user._id).select("-password -refreshToken");
  console.log(accessToken)

  // const option =  {
  //   httpOnly :true,
  //   secure : false,
  //   sameSite : "none",
  //   path: "/",
  // }

  return res
    .status(200)
    .json(new ApiResponse(200, {...loggedInUser , accessToken}, "Login Successfully"));
});


const updateAvatar = asyncHandler(async(req , res) => {
  // const {imageUrl} = req.file?.path;
   const avatarLocalPath = req.file ? req.file.path : null; // Use req.file.path for the file path
  
  if(!avatarLocalPath) {
    return next(new ApiError(400, "Avatar is required "));
  }

  const avatarUrl = await uploadImage(avatarLocalPath); 
  
   if(!avatarUrl) {
    return next(new ApiError(400, "Failed to upload avatar image"));
  } 

  const user  = await User.findByIdAndUpdate(req.user?._id , {
     $set : {
      imageUrl : avatarUrl.url, 
     },
    },
    { new: true, }
  )   
  
  return res.status((200).json(
    new ApiResponse(200, user.imageUrl, "User avatar updated successfully")
  ));  
})


const logoutUser = asyncHandler(async (req, res) => {
  return res.status(200).clearCookie("accessToken").json(
    new ApiResponse(200 , null , "User logout !")
  );
})

// update user info
const editUserInfo  = asyncHandler(async(req, res) => {
  const { data } = req.body;
   const { name, phoneNumber, lastName } = data;
  //  await deleteImageOnCloudinary(imageId); 
   const avatar = await uploadImage(avatarLocalPath);
   console.log(avatar);

  const user = await User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        name,
        phoneNumber,
        lastName,
      },
    },
    { new: true}
  ).select("-password -email");

  console.log(user);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
})


const forgetPassword = asyncHandler(async (req, res , next) => {
  const { _id } = req.user;
  const {email}  = req.body;

  const otp = generateOtp(); // Generate OTP

  let user = await User.findById(_id);

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  user = await User.findByIdAndUpdate(user._id , 
     {  $set  : { otp :  otp} },
     {new : true}
  )

  await sendMail(email, otp);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset link sent to your" + email));

});


const VerifyOtp = asyncHandler(async (req, res , next) => {
  const { otp } = req.body;
  const { _id } = req.user;
  let user = await User.findById(_id);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  } 

  if(user.otp !== otp) {
    return next(new ApiError(400, "Invalid OTP"));
  }

  if(user.otp === otp) {
    user.otp = undefined;
    await user.save();
    return res    .status(200)
    .json(new ApiResponse(200, null, "OTP verified successfully"));
  } 

  // delete user.otp;
})


const updatePassword = asyncHandler(async(req , res) => {
  
  const {password , confirmPassword} = req.body;
  
  const { _id } = req.user; 
  
  let user = await User.findById(_id);
  
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  
  if(password !== confirmPassword){
    return next(new ApiError(400, "Password and confirm password must be same"));
  }
  user.password = password;
  // console.log(bcrypt.decoded(user.password));
  user.password = bcrypt.hashSync(password , 10);
  console.log(user.password);
  await user.save({validateBeforeSave : true});  
  return res.status(200).json(new ApiResponse(200, null, "Password updated successfully")); 
})


export  {register , login , logoutUser , editUserInfo , forgetPassword , VerifyOtp , updatePassword , updateAvatar}