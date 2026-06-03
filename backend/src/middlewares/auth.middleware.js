import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { apiError } from "../utils/apiError.js";
import jwt from 'jsonwebtoken';
import mongoose, {get} from 'mongoose';
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { ProjectMembers } from "../models/projectmember.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
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

export const ValidateProjectPermission = (roles = []) => {
    return asyncHandler(async (req, res, next) => {
        const {projectId} = req.params;
        if(!projectId){
            throw new apiError(400, 'Project ID is required');
        }

        const projectMember = await ProjectMembers.findOne({
            project : new mongoose.Types.ObjectId(projectId),
            user : new mongoose.Types.ObjectId(req.user._id),
        });

        if(!projectMember){
            throw new apiError(403, 'Forbidden, you are not a member of this project');
        }

        const givenRole = projectMember?.role;
        req.user.role = givenRole; // to make user role available in next middlewares and controllers

        if(!roles.includes(givenRole)){
            throw new apiError(403, 'Forbidden, you do not have permission to perform this action');
        }
        next();
    });
};