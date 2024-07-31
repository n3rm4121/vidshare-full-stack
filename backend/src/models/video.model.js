import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
{
    url: {
        type: String, // cloudinary url
        required: true,
    },
    thumbnail: {
        type: String, // cloudinary url
        required: true
    },
    title: {
        type: String, // cloudinary url
        required: true,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        maxLength: 500,
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },  
    
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
    
   
},
{timestamps: true}
)

// adding pagination plugin to the schema
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)