import {User} from '../models/user.models.js';
import {apiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/async-handler.js';
import{apiError} from '../utils/apiError.js';
import {sendEmail , emailVerificationTemplate, ForgotPasswordTemplate} from '../utils/mails.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
//get data 
//check if user exist
//save user to db if not exist


const generateAccessAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken; 
        await user.save({validateBeforeSave : false});// to prevent running validation again as we are only updating refresh token
        return {accessToken, refreshToken};
    }
    catch(error){
        throw new apiError(500, 'Error generating tokens');
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password, role} = req.body; // variable names should be same as the keys in request body
    const existingUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existingUser){
        throw new apiError(409, 'Username or email already exists');
    }
    const user = await User.create({
        username,
        email,
        password,
        isEmailVerified : false,
    });
    
    const {unhashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save({validateBeforeSave : false});

    await sendEmail({
        email : user.email,
        subject : 'Email Verification',
        mailgenContent : emailVerificationTemplate(
            user.username,
            `${req.protocol}://${req.host}/api/v1/auth/verify-email/${unhashedToken}`,
        )
    });

    const registeredUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry",
    )
    if(!registeredUser){
        throw new apiError(500, 'Error registering user');
    }

    return res.status(201).json(new apiResponse(201, registeredUser, 'User registered successfully'));
});

const login = asyncHandler(async (req, res) => {
    const {email, password, username} = req.body;
    if(!email){
        throw new apiError(400, 'Email is required');
    }

    const user = await User.findOne({email});
    if(!user){
        throw new apiError(404, 'User not found');
    }
    const isPassValid = await user.comparePassword(password);
    if(!isPassValid){
        throw new apiError(401, 'Invalid credentials');
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry",
    )
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new apiResponse(200, {
        user : loggedInUser,
        accessToken,
        refreshToken,
    }, 'User logged in successfully'));
    
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set : {
            refreshToken : ""
        },
    }, {
        new : true,
    });
    const options = {
        httpOnly : true,
        secure : true,
    }
    return res.status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, null, 'User logged out successfully'));
});

const getCurrUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new apiResponse(200, req.user, 'Current user fetched successfully'));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const {token} = req.params;
    if(!token){
        throw new apiError(400, 'Token is required'); // status code 400 is for bad request
    }
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        emailVerificationToken : hashedToken,
        emailVerificationTokenExpiry : {$gt : Date.now()},
    });
    if(!user){
        throw new apiError(400, 'Invalid or expired token');
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    user.isEmailVerified = true;
    await user.save({validateBeforeSave : false});

    return res.status(200).json(new apiResponse(200, {
        isEmailVerified : user.isEmailVerified,
    }, 'Email verified successfully'));
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user){
        throw new apiError(404, 'User not found'); // 404 is for not found
    }

    if(user.isEmailVerified) {
        throw new apiError(409, 'Email is already verified'); // 409 is for conflict
    }

    const {unhashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;
    await user.save({validateBeforeSave : false});

    await sendEmail({
        email : user.email,
        subject : 'Email Verification',
        mailgenContent : emailVerificationTemplate(
            user.username,
            `${req.protocol}://${req.host}/api/v1/auth/verify-email/${unhashedToken}`,
        )
    });

    return res.status(200).json(new apiResponse(200, null, 'Verification email resent successfully'));

});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.header("Authorisation")?.replace("Bearer ", "");
    if(!refreshToken){
        throw new apiError(401, 'Unauthorized, token not found'); // 401 is for unauthorized
    }
    try{
       const decoder = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
       const user = await User.findById(decoder.userId);

       if(!user || user.refreshToken !== refreshToken){
        throw new apiError(401, 'Unauthorized, invalid token');
       }

       const options = {
        httpOnly : true,
        secure : true,
        }
        const {accessToken, refreshToken : newRefreshToken} = await generateAccessAndRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            200, {accessToken, refreshToken : newRefreshToken},
            "Access Token refreshed"
        );
    }
    catch(error){
        throw new apiError(401, 'Unauthorized, invalid token');
    }
});

const forgotPasswordReq = asyncHandler(async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new apiError(404, 'User not found');
    }
    
    const {unhashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken();

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpiry;
    await user.save({validateBeforeSave : false});
    // console.log(unhashedToken);
    await sendEmail({
        email : user.email,
        subject : 'Password Reset',
        mailgenContent : emailVerificationTemplate(
            user.username,
            `${process.env.RESET_PASSWORD_URL}/${unhashedToken}`,
        )
    });

    return res.status(200).json(new apiResponse(200, null, 'Password reset email sent successfully'));
});

const resetPassword = asyncHandler(async(req, res) => {
    const {token} = req.params;
    const {newPassword} = req.body;
    let hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

    const user = await User.findOne({
        forgotPasswordToken : hashedToken,
        forgotPasswordTokenExpiry : {$gt : Date.now()}
    })
    if(!user){
        throw new apiError(489, "Token is invalid or expired")
    }
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res.status(200)
    .json(
        new apiResponse(
            200, null, "Password reset successfully"
        )
    );
});

const changePassword = asyncHandler(async(req, res) => {
    const {currentPassword, newPassword} = req.body;
    const user = await User.findById(req.user._id);
    if(!user){
        throw new apiError(404, 'User not found');
    }
    const isPassValid = await user.comparePassword(currentPassword);
    if(!isPassValid){
        throw new apiError(401, 'Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();

    return res.status(200).json(new apiResponse(200, null, 'Password changed successfully'));
});

export { registerUser, generateAccessAndRefreshToken, login, logoutUser, getCurrUser, verifyEmail 
, resendEmailVerification, refreshAccessToken, forgotPasswordReq, resetPassword, changePassword
};