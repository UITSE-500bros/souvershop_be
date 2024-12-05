
import { Router } from 'express'
import { employeeController } from 'src/controllers';
const adminRouter = Router();

adminRouter.get('/employees', employeeController.getEmployees);

export default adminRouter;