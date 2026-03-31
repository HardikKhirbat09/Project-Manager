import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
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
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({userId : this._id,
        email : this.email, 
        username : this.username}, 
        process.env.ACCESS_TOKEN_SECRET, // like a password to prevent tampering of the token and check if token belongs to server
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({userId : this._id, 
        email : this.email,
        username : this.username
    }, 
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
}

userSchema.methods.generateTemporaryToken = function(){
    const unhashedToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(unhashedToken).digest('hex');

    const tokenExpiry = Date.now() + 20 * 60 * 1000; // Token valid for 20 minutes
    return { unhashedToken, hashedToken, tokenExpiry };
}

export const User = mongoose.model('User', userSchema);