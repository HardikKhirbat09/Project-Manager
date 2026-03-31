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
        inEmailVerified : false,
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

export { registerUser, generaeAccessAndRefreshToken };