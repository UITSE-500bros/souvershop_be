// middleware/authorizeRole.ts
import { Request, Response, NextFunction } from 'express';

interface User {
    id: number;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const authorizeRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "You don't have the required permissions." });
        }

        return next(); // User is authorized; proceed to the controller
    };
};

export default authorizeRole;
