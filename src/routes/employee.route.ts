import { Router } from 'express';
import authMiddleware from '../middleware/authorizeRole';
import { employeeController } from '../controllers';


const employeeRouter = Router();
employeeRouter.post('/update', authMiddleware, employeeController.updateOrderStatus);
employeeRouter.get('/orders', authMiddleware, employeeController.getOrders);

export default employeeRouter;