import { Router } from 'express';
import { getProjects, getProjectsById, updateProject,
    createProject, deleteProject, addMembersToProject, 
    getProjectMembers, removeMemberFromProject, updateProjectMemberRole } from '../controllers/project.controller.js';
import {validate} from '../middlewares/validator.middleware.js';
import {createProjectValidator, addProjectMemberValidator} from '../validators/index.js';
import { verifyJWT, ValidateProjectPermission } from '../middlewares/auth.middleware.js';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';
//import mongoose from 'mongoose';

const router = Router();
router.use(verifyJWT);// all routes after this middleware will require authentication

router.route("/").
get(getProjects).
post(createProjectValidator(), validate, createProject);

router.route("/:projectId").
get(ValidateProjectPermission(AvailableUserRole), getProjectsById)
.put(
    ValidateProjectPermission(UserRolesEnum.ADMIN)
    , createProjectValidator(), validate, updateProject
)
.delete(ValidateProjectPermission(UserRolesEnum.ADMIN), deleteProject);

router.route("/:projectId/members/").
get(getProjectMembers)
.post(addProjectMemberValidator(), validate, ValidateProjectPermission(UserRolesEnum.ADMIN), addMembersToProject);

router.route("/:projectId/members/:userId")
.delete(ValidateProjectPermission(UserRolesEnum.ADMIN), removeMemberFromProject)
.put(addProjectMemberValidator(), validate, ValidateProjectPermission(UserRolesEnum.ADMIN), updateProjectMemberRole);


export default router;