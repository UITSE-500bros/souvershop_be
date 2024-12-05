
import { Router } from 'express'
import { employeeController } from '../controllers';
const adminRouter = Router();

adminRouter.get('/employees', employeeController.getEmployees);

export default adminRouter;