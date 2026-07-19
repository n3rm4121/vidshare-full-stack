import mongoose, {Schema} from "mongoose";
import { SignJWT } from "jose";
import bcrypt from 'bcrypt'

const userSchema = new Schema(
{
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        lowercase: true,
        trim: true,
        index: true        // for searching in optimize way
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address'],
        maxLength: 50
    },
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        trim: true,
        index: true,
        maxLength: 50
    },
    about:{
        type: String,
        trim: true,
        maxLength: 500
    },
    avatar: {
        type: String, // cloudinary url

    },
    coverImage: {
        type: String
    },

    watchHistory: [
        {
            videoId: { type: Schema.Types.ObjectId, ref: 'Video' },
            watchedAt: { type: Date, default: Date.now }
        }
    ],
    password: {
        type: String,
        required: function(){
            return this.provider !== 'google';
        },
        minLength: 6,
        select: false
    },
    refreshToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
},
{timestamps: true}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}


userSchema.methods.generateAccessToken = async function(){
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    return await new SignJWT({
        _id: this._id.toString(),
        email: this.email,
        username: this.username,
        fullname: this.fullname
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.ACCESS_TOKEN_EXPIRY)
    .sign(secret);
}

userSchema.methods.generateRefreshToken = async function(){
    const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);
    return await new SignJWT({ _id: this._id.toString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRY)
    .sign(secret);
}

export const User = mongoose.model("User", userSchema)
