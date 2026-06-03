import {Router} from 'express';
import {validate} from '../middlewares/validator.middleware.js';
import {createNoteValidator, updateNoteValidator} from '../validators/index.js';
import { verifyJWT, ValidateProjectPermission } from '../middlewares/auth.middleware.js';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';
import {getNotes, createNote, getNoteById, updateNote, deleteNote} from '../controllers/notes.controller.js';

const router = Router();
router.use(verifyJWT);

// `GET /:projectId` - List project notes (secured, role-based)
// - `POST /:projectId` - Create note (secured, Admin only)
// - `GET /:projectId/n/:noteId` - Get note details (secured, role-based)
// - `PUT /:projectId/n/:noteId` - Update note (secured, Admin only)
// - `DELETE /:projectId/n/:noteId` - Delete note (secured, Admin only)

router.route("/:projectId")
    .get(ValidateProjectPermission(AvailableUserRole), getNotes)
    .post(createNoteValidator(),validate, ValidateProjectPermission([UserRolesEnum.ADMIN]), createNote);

router.route("/:projectId/n/:noteId")
    .get(ValidateProjectPermission(AvailableUserRole), getNoteById)
    .put(updateNoteValidator(),validate, ValidateProjectPermission([UserRolesEnum.ADMIN]), updateNote)
    .delete(ValidateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;