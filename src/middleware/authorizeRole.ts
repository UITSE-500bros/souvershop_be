import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  userId?: string;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
      return; // Ensure function exits after sending a response
    }

    const token = authHeader.split(' ')[1];

    // Replace 'your-secret-key' with your actual JWT secret
    const decoded = jwt.verify(token, 'your-secret-key') as { user_id: string };

    req.userId = decoded.user_id; // Attach user_id to request

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return; // Ensure function exits after sending a response
  }
};

export default authMiddleware;