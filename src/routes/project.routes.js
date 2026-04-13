import { Router } from 'express';
import { getProjects, getProjectsById, updateProject,
    createProject, deleteProject, addMembersToProject, 
    getProjectMembers, removeMemberFromProject, updateProjectMemberRole } from '../controllers/project.controller.js';
import {validate} from '../middlewares/validator.middleware.js';
import {createProjectValidator, addProjectMemberValidator} from '../validators/index.js';
import { verifyJWT, ValidateProjectPemission } from '../middlewares/auth.middleware.js';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';
import { get } from 'mongoose';

const router = Router();
router.use(verifyJWT);// all routes after this middleware will require authentication

router.route("/").
get(getProjects).
post(createProjectValidator(), validate, createProject);

router.route("/:projectId").
get(ValidateProjectPemission(AvailableUserRole), getProjectsById)
.put(
    ValidateProjectPemission(UserRolesEnum.ADMIN)
    , createProjectValidator(), validate, updateProject
)
.delete(ValidateProjectPemission(UserRolesEnum.ADMIN), deleteProject);

router.route("/:projectId/members/").
get(getProjectMembers)
.post(addProjectMemberValidator(), validate, ValidateProjectPemission(UserRolesEnum.ADMIN), addMembersToProject);

router.route("/:projectId/members/:userId")
.delete(ValidateProjectPemission(UserRolesEnum.ADMIN), removeMemberFromProject)
.put(addProjectMemberValidator(), validate, ValidateProjectPemission(UserRolesEnum.ADMIN), updateProjectMemberRole);


export default router;