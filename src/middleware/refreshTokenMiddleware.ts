import { NextFunction, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../services'; // Assuming user service is set up to handle DB queries

import { RefreshtokenRequest } from '../type';


export const refreshTokenMiddleware: RequestHandler = async (req: RefreshtokenRequest, res: Response, next: NextFunction): Promise<void>  => {

    const refreshToken = req.cookies.refreshToken;

    try {
        // Verify the refresh token (replace with your actual secret)
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Optional: Check if the refresh token belongs to a valid user (optional but recommended)
        const user = await userService.getUserByID((decoded as jwt.JwtPayload)._id);


        // Attach user information to the request object (for further use in routes)
        req.userId = user.user_id; // Attach user_id to request

        next();
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        
    }

};


export default refreshTokenMiddleware;