// verify if user is there or not

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
       // console.log("token", token)
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

       // console.log("decoded token: " , decodedToken)
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    
        if (!user) {
            throw new ApiError(401, "invalid access token")
        }
    
        req.user = user;
        // console.log("user: ", user)
        //console.log("req.user", req.user)
        //console.log("req: ", req);
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }

})

