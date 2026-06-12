import {User} from '../models/user.models.js';
import {apiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/async-handler.js';
import {apiError} from '../utils/apiError.js';
import {Tasks} from '../models/tasks.models.js';
import {Subtask} from '../models/subtasks.models.js';
import {Projects} from '../models/project.models.js';
import mongoose from 'mongoose';
import { AvailableUserRole } from '../utils/constants.js';

const getTasks = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const project = await Projects.findById(projectId);
    if(!project){
        throw new apiError(404, 'Project not found');
    }

    const tasks = await Tasks.find({ 
        project : new mongoose.Types.ObjectId(projectId),
    }).populate("assignedTo", "avatar username fullName");

    return res.status(200).json(new apiResponse(200, tasks, 'Tasks fetched successfully'));
});

const createTasks = asyncHandler(async (req, res) => {
    const {title, description, assignedTo, status} = req.body;
    const {projectId} = req.params;

    const project = await Projects.findById(projectId);
    if(!project){
        throw new apiError(404, 'Project not found');
    }

    const files = req.files || [];
    const attachments = files.map(file => {
        return {
            url : `${process.env.SERVER_URL}/images/${file.filename}`,
            mimeType : file.mimetype,
            size : file.size,
        }
    });

    const task = await Tasks.create({
        title,
        description,
        project : new mongoose.Types.ObjectId(projectId),
        assignedTo : assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined,
        assignedBy : new mongoose.Types.ObjectId(req.user._id),
        status,
        attachments,
    });

    return res.status(201).json(new apiResponse(201, task, 'Task created successfully'));
});

const getTasksById = asyncHandler(async (req, res) => {
    const {taskId} = req.params;

    const task = await Tasks.aggregate([
        {
            $match: {
                _id : new mongoose.Types.ObjectId(taskId),
            }
        },
        {
            $lookup : {
                from : 'users',
                localField : 'assignedTo',
                foreignField : '_id',
                as : 'assignedToDetails',
                pipeline : [
                    {
                       $project : { 
                            _id : 1,
                            username : 1,
                            fullName : 1,
                            avatar : 1,
                            email : 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup : {
                from : 'subtasks',
                localField : '_id',
                foreignField : 'task',
                as : 'subtask',
                pipeline : [
                    {
                       $lookup : {
                            from : 'users',
                            localField : 'createdBy',
                            foreignField : '_id',
                            as : 'createdByDetails',
                            pipeline : [
                                {
                                    $project : {
                                        _id : 1,
                                        username : 1, 
                                        fullName : 1,
                                        avatar : 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields : {
                            createdBy : {$arrayElemAt : ['$createdByDetails', 0]},
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                assignedTo : {$arrayElemAt : ['$assignedToDetails', 0]},
            }
        }
    ]);

    if(!task || task.length === 0){
        throw new apiError(404, 'Task not found');
    }

    return res.status(200).json(new apiResponse(200, task[0], 'Task fetched successfully'));
});

const updateTasks = asyncHandler(async (req, res) => {
    const {taskId} = req.params;
    const {title, description, assignedTo, status} = req.body;

    const task = await Tasks.findById(taskId);
    if(!task){
        throw new apiError(404, 'Task not found');
    }

    const files = req.files || [];

    const addedAttachments = files.map(file => {
        return {
            url : `${process.env.SERVER_URL}/images/${file.filename}`,
            mimeType : file.mimetype,
            size : file.size,
        }
    });

    if(title !== undefined) task.title = title;
    if(description !== undefined) task.description = description;
    if(assignedTo !== undefined) task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    if(status !== undefined) task.status = status;
    if(addedAttachments.length > 0) task.attachments.push(...addedAttachments);
    
    await task.save();
    return res.status(200).json(new apiResponse(200, task, 'Task updated successfully'));
});

const deleteTasks = asyncHandler(async (req, res) => {
    const {taskId} = req.params;

    const task = await Tasks.findById(taskId);
    if(!task){
        throw new apiError(404, 'Task not found');
    }
    await Subtask.deleteMany({task : new mongoose.Types.ObjectId(taskId)});
    await task.deleteOne();
    return res.status(200).json(new apiResponse(200, null, 'Task deleted successfully'));
});

const createSubtasks = asyncHandler(async (req, res) => {
    const {taskId} = req.params;

    const task = await Tasks.findById(taskId);
    if(!task){
        throw new apiError(404, 'Task not found');
    }

    const {title, description} = req.body;

    const subtask = await Subtask.create({
        title,
        description,
        task : new mongoose.Types.ObjectId(taskId),
        createdBy : new mongoose.Types.ObjectId(req.user._id),
    });

    return res.status(201).json(new apiResponse(201, subtask, 'Subtask created successfully')); 
});

const updateSubtasks = asyncHandler(async (req, res) => {
    const {subtaskId} = req.params;

    const subtask = await Subtask.findById(subtaskId);
    if(!subtask){
        throw new apiError(404, 'Subtask not found');
    }

    const {title, description, isCompleted} = req.body;

    const subtaskUpdated = await Subtask.findByIdAndUpdate(
        subtaskId,
        {
            title,
            description,
            isCompleted,
        },
        {new : true, runValidators : true},
    );

    return res.status(200).json(new apiResponse(200, subtaskUpdated, 'Subtask updated successfully'));
});

const deleteSubtasks = asyncHandler(async (req, res) => {
    const {subtaskId} = req.params;

    const subtask = await Subtask.findById(subtaskId);
    if(!subtask){
        throw new apiError(404, 'Subtask not found');
    }

    await subtask.deleteOne();
    return res.status(200).json(new apiResponse(200, null, 'Subtask deleted successfully'));
});

export { getTasks, createTasks, getTasksById,
     updateTasks, deleteTasks, createSubtasks,
      updateSubtasks, deleteSubtasks };