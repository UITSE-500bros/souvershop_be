// src/types/express.d.ts (or @types/express.d.ts)
import * as express from 'express';

declare global {
    namespace Express {
       
    }
}
export interface AuthenticatedRequest extends Request {
    customerId?: string; // Custom user identifier

}