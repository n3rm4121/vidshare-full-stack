import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import deleteMediaFromCloud from '../utils/deleteMediaFromCloud.js';
import { Video } from '../models/video.model.js';
import { isValidObjectId } from 'mongoose';
import { Token } from '../models/token.model.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

const verifyToken = asyncHandler(async (req, res) => {
    const { userId, token } = req.params;

    if (!userId || !token) {
        throw new ApiError(400, "Invalid token");
    }

    const isTokenExists = await Token.findOne({
        userId: userId,
        token: token,
        type: "emailVerification",
        expires: { $gt: Date.now() }
    });

    if (!isTokenExists) {
        return res.status(200).json(new ApiResponse(200, {}, "Invalid or expired token"));
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    user.isVerified = true;
    await user.save();

    await Token.deleteOne({ userId: userId, token: token });

    console.log("Verified user:", user);
    res.status(200).json(new ApiResponse(200, { user }, "Email verified successfully"));
});


const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        return res.status(400).json(new ApiResponse(400, {}, "User already exists"));
    }

    const user = await User.create({ fullname, email, password, username });

    const token = await new Token({
        userId: user._id,
        email: user.email,
        token: crypto.randomBytes(32).toString("hex"),
        type: "emailVerification",
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        
    }).save();

    // Send email verification link
    const verificationLink = `${process.env.CORS_ORIGIN}/user/verify/${user._id}/${token.token}`;

    await sendEmail({
        email: user.email,
        subject: "Welcome to VidShare - Verify your email",
        message: `Thank you for signing up. Click this link to verify your email: ${verificationLink}`
    });

    return res.status(201).json(new ApiResponse(201, {}, "User registered successfully. Please verify your email"));
});

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;
    
    

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "Incorrect Email or Password"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(404).json(new ApiResponse(404, {}, "Incorrect Email or Password"));
    }

    const isVerifiedUser = await User.findOne({ $or: [{ email }, { username }] });

    if(!isVerifiedUser.isVerified){
        return res.status(400).json(new ApiResponse(400, {}, "Please verify your email"));
    }
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // for sending cookies 
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: false // true for production https
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { newRefreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body



    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "user fetched successfully"
        )
    )
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User is not authenticated");
    }

    const { fullname, email, about } = req.body;
    // console.log('Request Body:', req.body);

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email,
                about: about
            }
        },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    console.log('Updated User:', user);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));
});


const updateUserAvatar = asyncHandler(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "User is not authenticated");
    }
    const oldImagePath = req.user.avatar;
    // console.log("oldimagepath : ", oldImagePath)
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary
        (avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url.replace('http', 'https')
            }
        },
        { new: true }
    ).select("-password")

    await deleteMediaFromCloud(oldImagePath, 'image', "avatar");
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "avatar image updated successfully")
        )

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User is not authenticated");
    }

    const oldImagePath = req.user.coverImage;
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file is missing")
    }

    const coverImage = await uploadOnCloudinary
        (coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url.replace('http', 'https')
            }
        },
        { new: true }
    ).select("-password")

    await deleteMediaFromCloud(oldImagePath, 'image', "coverImage");
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "cover image updated successfully")
        )
})


const getUserChannelProfile = asyncHandler(async (req, res) => {

    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"  // array
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $addFields: {
                videosCount: {
                    $size: "$videos",
                },
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                videosCount: 1,
                about: 1
            }
        }

    ]) // will return array

    console.log(channel);
    if (!channel?.length) {
        throw new ApiError(404, "channel doesnot exists")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        )

})


const getWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const user = await User.aggregate([
        {
            $match: {
                _id: userId
            }
        },
        {
            $unwind: "$watchHistory"
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory._id",
                foreignField: "_id",
                as: "video"
            }
        },
        {
            $unwind: "$video"
        },
        {
            $lookup: {
                from: "users",
                localField: "video.owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 0,
                video: {
                    _id: "$video._id",
                    title: "$video.title",
                    description: "$video.description",
                    thumbnail: "$video.thumbnail",
                    duration: "$video.duration",
                    url: "$video.url",
                    views: "$video.views",
                    createdAt: "$video.createdAt",
                    owner: "$owner",
                    watchedAt: "$watchHistory.watchedAt"
                }
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user.map(u => u.video),
                "Watch history fetched successfully"
            )
        );
});


const updateWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.body;
    const userId = req.user._id;


    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.watchHistory.push(videoId);
    await user.save();
    return res.status(200).json({ message: 'Video added to watch history' })


})

const deleteWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.body;

    // Validate videoId if provided
    if (videoId && !isValidObjectId(videoId)) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid video ID"));
    }

    let updateQuery;

    if (videoId) {
        // Remove specific video from watch history
        updateQuery = { $pull: { watchHistory: { _id: videoId } } };
    } else {
        // Clear all watch history
        updateQuery = { $set: { watchHistory: [] } };
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updateQuery,
        { new: true }
    );

    if (!user) {
        return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const message = videoId
        ? "Video removed from watch history successfully"
        : "Watch history cleared successfully";

    return res.status(200).json(new ApiResponse(200, {}, message));
});



const getUserVideos = asyncHandler(async (req, res) => {
    const { username } = req.params; // Use username instead of userId

    if (!username) {
        throw new ApiError(400, "Username is missing");
    }

    // Find the user by username
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Fetch videos where the owner field matches the user's ID
    // and populate owner iwth username, fullname, avatar

    
    const videos = await Video.aggregate([

        {
            $match: {
                owner: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                url: 1,
                views: 1,
                createdAt: 1,
                owner: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1
                }
            }
        }
    ]);


   
         

    if (!videos.length) {
        return res.status(200).json({ data: [], message: "No videos found" });
    }

    return res.status(200).json({ data: videos, message: "Videos fetched successfully" });
});

const deleteUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await Video.deleteMany({ owner: userId });

    await Comment.deleteMany({ user: userId });

    await Subscription.deleteMany({ $or: [{ subscriber: userId }, { channel: userId }] });

    await Like.deleteMany({ user: userId });

    await Playlist.deleteMany({ owner: userId });


    await User.deleteOne({ _id: userId });

    return res.status(200).json({ message: "User account and all related data deleted successfully" });
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory, updateWatchHistory, getUserVideos, deleteUserAccount, deleteWatchHistory, verifyToken };
