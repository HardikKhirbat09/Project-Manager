import mongoose, {Schema} from 'mongoose';
import { bcrypt } from 'bcrypt';

const userSchema = new Schema({
    avatar: {
        type :{
            url : String,
            localPath : String,
        },
        default : {
            url : ``,
            localPath : ``,
        }
    },
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,   
    },
    fullname : {
        type : String,
        trim : true,
    },
    password : {
        type : String,
        required : [true, 'Password is required'],
    },
    isEmailVerified : {
        type : Boolean,
        default : false,
    },
    refreshToken : {
        type : String,
    },
    forgotPasswordToken : {
        type : String,
    },
    forgotPasswordTokenExpiry : {
        type : Date,
    },
    emailVerificationToken : {
        type : String,
    },
    emailVerificationTokenExpiry : {
        type : Date,
    },
}, {
    timestamps : true,
})
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
        
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
export const User = mongoose.model('User', userSchema);