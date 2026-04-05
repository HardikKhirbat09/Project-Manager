import mongoose, {Schema} from 'mongoose';
import { TaskStatusEnum, AvailableTaskStatus } from '../utils/constants';

const taskSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    project : {
        type : Schema.Types.ObjectId,
        ref : 'Project',
        required : true,
    },
    assignedTo : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    },
    assignedBy : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    },
    status : {
        type : String,
        enum : AvailableTaskStatus,
        default : TaskStatusEnum.TODO,
    },
    attachment : {
        type : [{
            url : String,
            mimeType : String,
            size : Number,
        }],
        default : [],
    },
}, {
    timestamps : true,
});

export const Tasks = mongoose.model('Tasks', taskSchema);
    