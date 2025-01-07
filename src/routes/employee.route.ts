import { Router } from 'express';
import authMiddleware from '../middleware/authorizeRole';
import { employeeController } from '../controllers';


const router = Router();
router.post('/update', authMiddleware, employeeController.updateOrderStatus);