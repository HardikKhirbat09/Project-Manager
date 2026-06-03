import {User} from '../models/user.models.js';
import {apiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/async-handler.js';
import {apiError} from '../utils/apiError.js';
import {Projects} from '../models/project.models.js';
import {ProjectNote} from '../models/notes.models.js';
import mongoose from 'mongoose';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';
import { createNoteValidator, updateNoteValidator } from '../validators/index.js';
import {validate} from '../middlewares/validator.middleware.js';
import { verifyJWT, ValidateProjectPermission } from '../middlewares/auth.middleware.js';

const getNotes = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const project = await Projects.findById(projectId);
    if(!project){
        throw new apiError(404, 'Project not found');
    }

    const notes = await ProjectNote.find({
        project : new mongoose.Types.ObjectId(projectId),
    });

    return res.status(200).json(new apiResponse(200, notes, 'Notes fetched successfully'));
});

const createNote = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const {content} = req.body;

    const project = await Projects.findById(projectId);
    if(!project){
        throw new apiError(404, 'Project not found');
    }

    const note = await ProjectNote.create({
        project : new mongoose.Types.ObjectId(projectId),
        createdBy : new mongoose.Types.ObjectId(req.user._id),
        content,
    });

    return res.status(201).json(new apiResponse(201, note, 'Note created successfully'));
});

const getNoteById = asyncHandler(async (req, res) => {
    const {noteId} = req.params;

    const note = await ProjectNote.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(noteId),
            }
        },
        {
            $lookup : {
                from : 'projects',
                localField : 'project', 
                foreignField : '_id',
                as : 'projectDetails',
                pipeline : [
                    {
                        $lookup : {
                            from : 'users',
                            localField : 'createdBy',
                            foreignField : '_id',
                            as : 'projectCreator',
                        }
                    }
                ]
            }
        },
        {
            $unwind : '$projectDetails',
        },
        {
            $lookup : {
                from : 'users',
                localField : 'createdBy',
                foreignField : '_id',
                as : 'createdByDetails',
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            fullName : 1,
                            avatar : 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind : '$createdByDetails',
            preserveNullAndEmptyArrays : true,
        },
        
    ])
});

const updateNote = asyncHandler(async (req, res) => {
    const {noteId} = req.params;
    const {content} = req.body;

    const note = await ProjectNote.findbyIdandUpdate(
        noteId,
        {
            content,
        },
        {
            new : true,
        }
    );

    if(!note){
        throw new apiError(404, 'Note not found');
    }

    return res.status(200).json(new apiResponse(200, note, 'Note updated successfully'));
    
});

const deleteNote = asyncHandler(async (req, res) => {
    const {noteId} = req.params;

    const note = await ProjectNote.findByIdAndDelete(noteId);
    
    if(!note){
        throw new apiError(404, 'Note not found');
    }

    return res.status(200).json(new apiResponse(200, null, 'Note deleted successfully'));
});
    
export { getNotes, createNote, getNoteById, updateNote, deleteNote };


