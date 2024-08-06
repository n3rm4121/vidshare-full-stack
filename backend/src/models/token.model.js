import mongoose from "mongoose";
import { Schema } from "mongoose";

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    }, 
    type: {
        type: String,
        required: true  
    },
    expires: {
        type: Date,
        required: true
    },
    email: {
        type: String, 
        required: true
    }
        
}, {
    timestamps: true
});

export const Token = mongoose.model('Token', tokenSchema);