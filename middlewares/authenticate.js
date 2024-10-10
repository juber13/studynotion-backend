import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

const auth = async(req, _, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "") || req.body.token;
        console.log("Token from cookies:", req.cookies?.token);
        console.log("Token from Authorization header:", req.header("Authorization")?.replace("Bearer ", ""));
        console.log("Token from body:", req.body.token);
        console.log("Final token used:", token);
        
        if (!token) {
            throw new ApiError(401, "You are not authenticated");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        console.log(decodedToken)
        const user = await User.findById(decodedToken.id);
        
        if (!user) {
            throw new ApiError(401, "User not found");
        }
        req.user = user;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError(401, "Invalid token"));
        }
        return next(error);
    }
}
export default auth;