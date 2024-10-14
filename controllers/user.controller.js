import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import cloudinary from 'cloudinary'
// import token from "../utils/token.js";
// const  cloudinary = require("cloudinary");


import uploadImage  from "../utils/cloudinary.js";
import { tokengenerator } from "../utils/token.js";

// register user method post url[http://localhost:5000/user/register]
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword, role, lastName, phoneNumber } = req.body;
  console.log(req.file)
  // const avatarLocalPath = req.file ? req.file : null;  
  const avatarLocalPath = req.file ? req.file.path : null; // Use req.file.path for the file path
  // console.log(avatarLocalPath)

  if (!avatarLocalPath) {
    return res
      .status(400)
      .json({ success: false, error: "File upload failed" });
  }

  if ([name, email, password, lastName, confirmPassword, phoneNumber, role].some((field) => field === "")) {
    return next(new ApiError(400, "All fields are required"));
  }

  if (password !== confirmPassword) {
    return next(new ApiError(400, "Password and confirm password do not match"));
  }

  if (email.indexOf("@") === -1) {
    return next(new ApiError(400, "Invalid email format"));
  }

  
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    return next(new ApiError(400, "User already exists"));
  }


    if (!avatarLocalPath) {
      return next(new ApiError(400, "Avatar image is required"));
    } 

    const avatar = await uploadImage(avatarLocalPath);
    console.log("avatar response from cloudinary "+ avatar);

    if (!avatar) {
      return next(new ApiError(400, "Failed to upload avatar image"));
    }

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

  // Check if any of the input fields are empty
  if ([email, password].some((field) => !field)) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Find user without excluding password
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
  const token = await tokengenerator(user._id);
  const loggedInUser  = await User.findById(user._id).select("-password -refreshToken")

  return res
    .status(200)
    .json(new ApiResponse(200, { ...loggedInUser, token }, true, "Login Successfully"));
});


const logoutUser = asyncHandler(async (req, res) => {
  // delete user referesh token when ever u generate the referahe token
  return res.status(200).clearCookie("accessToken").json(
    new ApiResponse(200 , null , "User logout !")
  );
})

//  update user info

const deleteImageOnCloudinary = async(publicId) => {
  try{ 
    await cloudinary.v2.uploader.destroy(publicId);
    console.log("image deleted from cloudinary")
  }catch(err){
    console.log("Error while deleting the image from cloudinary" + err)
  }
}
// update user info
const editUserInfo  = asyncHandler(async(req, res) => {
  const { data } = req.body;
   const { name, phoneNumber, lastName } = data;
   const avatarLocalPath = req.file ? req.file.path : null; // Use req.file.path for the file path
   const { imageId , _id } = await User.findOne({ _id: req.user._id }); 
   await deleteImageOnCloudinary(imageId); 
   const avatar = await uploadImage(avatarLocalPath , true , imageId);

  const user = await User.findByIdAndUpdate(
    _id,
    {
      $set: {
        name,
        phoneNumber,
        lastName,
        imageUrl: avatar.url,
        imageId : avatar.public_id
      },
    },
    { new: true, runValidators: true }
  ).select("-password -email");

  console.log(user);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
})




export  {register , login , logoutUser , editUserInfo}