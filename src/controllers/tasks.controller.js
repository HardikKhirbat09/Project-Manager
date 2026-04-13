import {User} from '../models/user.models.js';
import {apiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/async-handler.js';
import{apiError} from '../utils/apiError.js';
import {Tasks} from '../models/tasks.models.js';
import {Subtask} from '../models/subtasks.models.js';
import {Projects} from '../models/project.models.js';
import mongoose, { get } from 'mongoose';
import { AvailableUserRole } from '../utils/constants.js';

const getTasks = asyncHandler(async (req, res) => {

});

const createTasks = asyncHandler(async (req, res) => {

});

const getTasksById = asyncHandler(async (req, res) => {

});

const updateTasks = asyncHandler(async (req, res) => {

});

const deleteTasks = asyncHandler(async (req, res) => {

});

const createSubtasks = asyncHandler(async (req, res) => {

});

const updateSubtasks = asyncHandler(async (req, res) => {

});

const deleteSubtasks = asyncHandler(async (req, res) => {

});

export { getTasks, createTasks, getTasksById,
     updateTasks, deleteTasks, createSubtasks,
      updateSubtasks, deleteSubtasks };