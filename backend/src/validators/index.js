import {body} from 'express-validator';
import { AvailableUserRole } from '../utils/constants.js';

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

const createProjectValidator = () => {
    return [
        body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required"),
        body("description")
        .trim()
        .optional()
    ];
};

const addProjectMemberValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
        body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(AvailableUserRole)
        .withMessage(`Role is invalid`)
    ];
};

const createTaskValidator = () => {
    return [
        body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required"),
        body("description")
        .trim()
        .optional(),
        body("status")
        .trim()
        .optional()
        .isIn(["todo", "in-progress", "done"])
        .withMessage("Invalid status value"),
        body("assignedTo")
        .trim()
        .optional()
        .isMongoId()
        .withMessage("Invalid user ID for assignedTo field")
    ];
};

const updateTaskValidator = () => {
    return [
        body("title")
        .trim()
        .optional()
        .notEmpty()
        .withMessage("Task title cannot be empty"),
        body("description")
        .trim()
        .optional(),
        body("status")
        .trim()
        .optional()
        .isIn(["todo", "in-progress", "done"])
        .withMessage("Invalid status value"),
        body("assignedTo")
        .trim()
        .optional()
        .isMongoId()
        .withMessage("Invalid user ID for assignedTo field")
    ];
};

const createSubtaskValidator = () => {
    return [
        body("title")
        .trim()
        .notEmpty()
        .withMessage("Subtask title is required"),
        body("description")
        .trim()
        .optional(),
        body("status")
        .trim()
        .optional()
        .isIn(["todo", "in-progress", "done"])
        .withMessage("Invalid status value"),
    ];
};

const updateSubtaskValidator = () => {
    return [
        body("title")
        .trim()
        .optional()
        .notEmpty()
        .withMessage("Subtask title cannot be empty"),
        body("description")
        .trim()
        .optional(),
        body("status")
        .trim()
        .optional()
        .isBoolean()
        .withMessage("Status must be a boolean value"),
    ];
};
const createNoteValidator = () => {
    return [
        body("content")
        .trim()
        .notEmpty()
        .withMessage("Note content is required"),
    ];
};

const updateNoteValidator = () => {
    return [
        body("content")
        .trim()
        .optional()
        .notEmpty()
        .withMessage("Note content cannot be empty"),
    ];
};

export {userRegistrationValidator, userLoginValidator, 
    userChangePasswordValidator, userForgotPasswordValidator, userResetPasswordValidator, 
    createProjectValidator, addProjectMemberValidator, createTaskValidator, 
    updateTaskValidator, createSubtaskValidator, updateSubtaskValidator, createNoteValidator, updateNoteValidator};