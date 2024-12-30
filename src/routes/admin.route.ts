import { Router } from 'express'
import ownerController from '../controllers/owner.controller';
import { upload } from '../middleware';

const adminRouter = Router();

adminRouter.post('/create_employee', upload.single('file'),ownerController.createEmployeeAccount);
// adminRouter.get('/get_employee', ownerController.getEmployeeAccount);
// adminRouter.get('/get_employee/:id', ownerController.getEmployeeAccountById);
adminRouter.put('/update_employee/:id', upload.single('file'), ownerController.updateEmployeeAccount);
adminRouter.delete('/delete_employee/:id', ownerController.deleteEmployeeAccount);

export default adminRouter;