import {User} from '../models/user.models.js';
import {apiResponse} from '../utils/apiResponse.js';
import {asyncHandler} from '../utils/async-handler.js';
import{apiError} from '../utils/apiError.js';
// import {sendEmail , emailVerificationTemplate, ForgotPasswordTemplate} from '../utils/mails.js'; -> can use it 
// like if we want to send email when user is added to project or when task is assigned to user etc
import {ProjectMembers} from '../models/projectmember.models.js';
import {Projects} from '../models/project.models.js';
import mongoose from 'mongoose';
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js';


const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMembers.aggregate([
        {
            $match : {
                user : new mongoose.Types.ObjectId(req.user._id),
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
                            from : 'projectmembers',
                            localField : '_id',
                            foreignField : 'project',
                            as : 'projectMembers',
                        }
                    },
                    {
                        $addFields : {
                            totalMembers : {$size : '$projectMembers'},
                        }
                    }
                ]
            }
        },
        {
            $unwind : '$projectDetails',
        },
        {
            $project : {
                project : {
                    _id : 1,
                    name : 1,
                    description : 1,
                    createdAt : 1,
                    createdBy : 1,
                },
                role : 1,
                id : 0
            }
        }
        
    ]);   
    return res.status(200).json(new apiResponse(200, projects, 'Projects fetched successfully'));
});

const getProjectsById = asyncHandler(async (req, res) => {
    const {projectId} = req.params;

    const project = await Projects.findById(projectId);

    if(!project){
        throw new apiError(404, 'Project not found');
    }
    return res.status(200).json(new apiResponse(200, project, 'Project fetched successfully'));
});

const updateProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const {projectId} = req.params;

    const project = await Projects.findByIdAndUpdate(
        projectId,
        {
            name, 
            description,
        },
        {new : true, runValidators : true}, // to return the updated document and to run validators on update
        
    )
    if(!project){
        throw new apiError(404, 'Project not found');
    }
    return res.status(200).json(new apiResponse(200, project, 'Project updated successfully'));
});

const createProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    const project = await Projects.create({
        name, 
        description,
        createdBy : new mongoose.Types.ObjectId(req.user._id), // as req.user._id is string and
        //  createdBy is ObjectId so we need to convert it to ObjectId
    });

    const projectMember = await ProjectMembers.create({
        user : new mongoose.Types.ObjectId(req.user._id),
        project : new mongoose.Types.ObjectId(project._id),
        role : UserRolesEnum.ADMIN,
    });

    return res.status(201).json(new apiResponse(201, project, 'Project created successfully'));

});

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const project = await Projects.findByIdAndDelete(projectId);
    if(!project){
        throw new apiError(404, 'Project not found');
    }
    await ProjectMembers.deleteMany({project : project._id}); // to remove all members associated with the project
    return res.status(200).json(new apiResponse(200, null, 'Project deleted successfully'));
});

const addMembersToProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const {email, role} = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw new apiError(404, 'User not found');
    }

    await ProjectMembers.findByIdAndUpdate(
        {
            user : new mongoose.Types.ObjectId(user._id),
            project : new mongoose.Types.ObjectId(projectId),
        },
        {
            user : new mongoose.Types.ObjectId(user._id),
            project : new mongoose.Types.ObjectId(projectId),
            role,
        },
        {
            upsert : true, // to create a new document if not found
            new : true, // to return the updated document
        }
    );  
    return res.status(200).json(new apiResponse(200, null, 'Member added to project successfully'));
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const {projectId} = req.params;
    const project = await Projects.findById(projectId);
    if(!project){
        throw new apiError(404, 'Project not found');
    }
    const members = await ProjectMembers.aggregate([
        {
            $match : {
                project : new mongoose.Types.ObjectId(projectId),
            }
        },
        {
            $lookup : {
                from : 'users',
                localField : 'user',
                foreignField : '_id',
                as : 'userDetails',
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
                user : {$arrayElemAt : ['$userDetails', 0]}, // to get the first element of the userDetails array
           }
        },

        {
            $project : {
                project : 1,
                user : 1,
                role : 1,
                createdAt : 1,
                updatedAt : 1,
                _id : 0,
            }
        }
    ]);
    return res.status(200).json(new apiResponse(200, members, 'Project members fetched successfully'));
});

const removeMemberFromProject = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params;
    const project = await Projects.findById(projectId);
    if(!project){
        throw new apiError(404, 'Project not found');
    }

    const user = await User.findById(userId);
    if(!user){
        throw new apiError(404, 'User not found');
    }

    await ProjectMembers.findOneAndDelete({
        project : new mongoose.Types.ObjectId(projectId),
        user : new mongoose.Types.ObjectId(userId),
    });
    return res.status(200).json(new apiResponse(200, null, 'Member removed from project successfully'));
});

const updateProjectMemberRole = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params;
    const {role} = req.body;
    if(!AvailableUserRole.includes(role)){
        throw new apiError(400, 'Invalid role');
    }
    const projectMember = await ProjectMembers.findOneAndUpdate(
        {
            project : new mongoose.Types.ObjectId(projectId),
            user : new mongoose.Types.ObjectId(userId),
        },
        {
            role,
        },
        {
            new : true,
        }
    );
    return res.status(200).json(new apiResponse(200, projectMember, 'Project member role updated successfully'));
});

export { getProjects, getProjectsById, updateProject,
    createProject, deleteProject, addMembersToProject, 
    getProjectMembers, removeMemberFromProject, updateProjectMemberRole };
