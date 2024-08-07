import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyToken = async (token) => {
    try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if(!payload.aud || payload.aud !== process.env.GOOGLE_CLIENT_ID) {
            throw new Error("Invalid token audience");
        }

        return payload;
     
    } catch (error) {
        throw new Error("Invalid token");
    }
  }


const googleLogin = asyncHandler(async(req,res) => {
    const {token} = req.body;
    let payload = await verifyToken(token);
    let user = await User.findOne({email: payload.email});

    if(!user){
        user = new User({
            email: payload.email,
            username: payload.email.slice(0, payload.email.indexOf("@")),
            fullname: payload.name,
            avatar: payload.picture,
            isVerified: true,
            provider: "google",
        });

        await user.save();
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if(!accessToken){
        throw new Error("Access token could not be generated");
    }
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
 

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ user, accessToken });

})

export {googleLogin};