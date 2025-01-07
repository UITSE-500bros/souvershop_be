// src/types/express.d.ts (or @types/express.d.ts)
import * as express from 'express';
import { Request } from 'express';
declare global {
    namespace Express {
       
    }
}
export interface AuthenticatedRequest extends Request {
    userId?: string; // Custom user identifier
}
export interface RefreshtokenRequest extends Request {
    cookies: any;
    userId?: string; // Custom user identifier
}