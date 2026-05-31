import { Router } from 'express';
import { getTasks, createTasks, getTasksById,
     updateTasks, deleteTasks, createSubtasks,
      updateSubtasks, deleteSubtasks } from '../controllers/tasks.controller.js';
import {validate} from '../middlewares/validator.middleware.js';
import {createTaskValidator, createSubtaskValidator, 
    updateSubtaskValidator, updateTaskValidator} from '../validators/index.js';
import { verifyJWT, ValidateProjectPermission } from '../middlewares/auth.middleware.js';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';

const router = Router();
router.use(verifyJWT);

router.route("/:projectId")
.get(ValidateProjectPermission(AvailableUserRole), getTasks)
.post(
    ValidateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    createTaskValidator(), validate, createTasks
);

router.route("/:projectId/t/:taskId")
.get(ValidateProjectPermission(AvailableUserRole), getTasksById)
.put(
    ValidateProjectPermission(UserRolesEnum.ADMIN),
    updateTaskValidator(), validate, updateTasks
)
.delete(ValidateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), deleteTasks);

router.route("/:projectId/t/:taskId/subtasks")
.post(
    ValidateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    createSubtaskValidator(), validate, createSubtasks
)

router.route("/:projectId/st/:subTaskId")
.put(
    ValidateProjectPermission(AvailableUserRole),
    updateSubtaskValidator(), validate, updateSubtasks
)
.delete(ValidateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]), deleteSubtasks);

export default router;