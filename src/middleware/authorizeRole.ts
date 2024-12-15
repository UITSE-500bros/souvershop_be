import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    customerId?: string; // Custom user identifier
}


const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
      return; // Ensure function exits after sending a response
    }

    const token = authHeader.split(' ')[1];

    // Replace 'your-secret-key' with your actual JWT secret
    const decoded = jwt.verify(token, 'souvershop') ;
    req.customerId = (decoded as jwt.JwtPayload)._id; // Attach user_id to request
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return; // Ensure function exits after sending a response
  }
};

export default authMiddleware;