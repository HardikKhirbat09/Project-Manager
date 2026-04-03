import {body} from 'express-validator';

const userRegistrationValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be in lowercase")
        .isLength({min : 3})
        .withMessage("Username must be at least 3 characters long"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({min : 6})
        .withMessage("Password must be at least 6 characters long")
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
        .trim()
        .optional()
        .isEmail()
        .withMessage("Invalid email format"),
        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
    ]
}

const userChangePasswordValidator = () => {
    return [
        body("currentPassword")
        .trim()
        .notEmpty()
        .withMessage("Current password is required"),
        body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required")
        .isLength({min : 6})
        .withMessage("New password must be at least 6 characters long")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
    ]
}
const userResetPasswordValidator = () => {
    return [
        body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New password is required")
        .isLength({min : 6})
        .withMessage("New password must be at least 6 characters long")
    ]
}

export {userRegistrationValidator, userLoginValidator, 
    userChangePasswordValidator, userForgotPasswordValidator, userResetPasswordValidator};