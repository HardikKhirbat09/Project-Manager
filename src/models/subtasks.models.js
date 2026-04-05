import mongoose, {Schema} from 'mongoose';

const subtaskSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    task : {
        type : Schema.Types.ObjectId,
        ref : 'Tasks',
        required : true,
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    isCompleted : {
        type : Boolean,
        default : false,
    },
}, {
    timestamps : true,
});

export const Subtask = mongoose.model('Subtask', subtaskSchema);