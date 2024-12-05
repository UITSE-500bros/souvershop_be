import { Request, Response } from 'express';
import { employeeService } from '../services';

class EmployeeController {
    
    async getEmployees(req: Request, res : Response) {
        const employees = await employeeService.getEmployee();
        res.json(employees);
    }
}
const employeeController = new EmployeeController();
export default employeeController;