import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
    },

    role: {
      type: String,
      required: [true, "role is required"],
    },

    refreshToken: {
      type: String,
    },

    imageUrl: {
      type: String,
    },

    imageId: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    courses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    otp: {
      type: String,
    },

    courseProgress: {
      type: String,
      ref: "Course",
    },
  },
  { timestamps: true }
);


userSchema.pre("save" , async function(next){
    if(!this.isModified("password"))  return next();

    this.password = await bcrypt.hash(this.password , 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
} 

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ id: this._id , email : this.email , name : this.name }, 
    process.env.JWT_ACCESS_TOKEN_SECRET, { 
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_KEY , {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
}







export const User = mongoose.model("User" , userSchema)