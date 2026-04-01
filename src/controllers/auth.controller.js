import {User} from '../models/user.models.js';
import {apiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/async-handler.js';
import{apiError} from '../utils/apiError.js';
import {sendEmail , emailVerificationTemplate} from '../utils/mails.js';
//get data 
//check if user exist
//save user to db if not exist


const generaeAccessAndRefreshToken = async (userId) => {
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
    const {username, email, password, role} = req.body;
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
            `${req.protocol}://${req.host}/api/v1/users/verify-email/${unhashedToken}`,
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

    const {accessToken, refreshToken} = await generaeAccessAndRefreshToken(user._id);

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

export { registerUser, generaeAccessAndRefreshToken, login, logoutUser };