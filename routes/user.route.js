import { Router } from "express";

const userRouter = Router();
import { register , login, logoutUser , editUserInfo, forgetPassword, VerifyOtp, updatePassword} from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticate.js";


// const { upload } from '../middlewares/multer.js'
import { upload } from "../middlewares/multer.js";
userRouter.post("/register", upload.single("imageUrl"), register);
userRouter.post("/login", login);
userRouter.put("/update" , authenticate ,upload.single("imageUrl") , editUserInfo)
userRouter.post("/forgetPassword" , authenticate , forgetPassword)
userRouter.post("/verifyOtp" , authenticate , VerifyOtp)
userRouter.post("/updatePassword" , authenticate , updatePassword)
// userRouter.post('/logout' , auth , logoutUser )

export default userRouter;