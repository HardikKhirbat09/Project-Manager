import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { apiError } from "../utils/apiError.js"; 
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer ", "");
    if(!token){
        throw new apiError(401, 'Unauthorized, token not found');
    }
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?.userId)
        .select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");
        if(!user){
            throw new apiError(401, 'Unauthorized, user not found');
        }
        req.user = user; // to make user data available in next middlewares and controllers
        next();
    }
    catch(error){
        throw new apiError(401, 'Unauthorized, invalid token');
    }

});