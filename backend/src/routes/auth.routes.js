import { Router } from 'express';
import {registerUser, login, logoutUser, refreshAccessToken,
     verifyEmail,
    forgotPasswordReq, resetPassword, getCurrUser, changePassword, resendEmailVerification } from '../controllers/auth.controller.js';
import {validate} from '../middlewares/validator.middleware.js';
import {userRegistrationValidator, userLoginValidator, 
    userResetPasswordValidator, userForgotPasswordValidator, userChangePasswordValidator} from '../validators/index.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

//unsecured routes , ie routes that can be accessed without authentication
router.route('/register').post(userRegistrationValidator(), validate, registerUser);
router.route('/login').post(userLoginValidator(), validate, login);
router.route('/verify-email/:token').get(verifyEmail);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/forgot-password').post(userForgotPasswordValidator(), validate, forgotPasswordReq);
router.route('/reset-password/:token').post(userResetPasswordValidator(), validate, resetPassword);

// secured routes , ie routes that require authentication
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/current-user').get(verifyJWT, getCurrUser);
router.route('/change-password').post(verifyJWT, userChangePasswordValidator(), validate, changePassword);
router.route('/resend-email-verification').post(verifyJWT, resendEmailVerification);
export default router;
