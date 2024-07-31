import mongoose, {Schema} from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt'

const userSchema = new Schema(
{
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required'],
        lowercase: true,
        trim: true,
        index: true         // for searching in optimize way
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        // unique: true,
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
        required: [true, 'Password is required'],
    },
    refreshToken: {
        type: String,
    }
},
{timestamps: true}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

/* 
If the password field has been modified (or is new), it generates a salt and then hashes the password using that salt. The hashed password is then stored in place of the plain text password.
*/


//  to check if the provided password matches the hashed password stored in the database.
userSchema.methods.isPasswordCorrect = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname : this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)