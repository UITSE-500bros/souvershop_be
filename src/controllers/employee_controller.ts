import Employee from "~/models/employee";
import { employeeService } from "~/services";
import { Request, Response } from 'express';
export class EmployeeController {
    async handleLogin(res: Response, req: Request):Promise<Response> {
        const {employee_email, employee_password} = req.body;
        const result = await employeeService.getEmployee(employee_email);
        if (result === null) {
            throw new Error('Password incorrect');
        }
        return res.status(200).json(result);
    }
    async handleGetAllEmployees(res: Response, req: Request):Promise<Response> {
        const result = await employeeService.getAllEmployees();
        if (result === null) {
            throw new Error('Password incorrect');
        }
        return res.status(200).json(result);
        
    }
    async handleCreateEmployee(req: Request, res: Response):Promise<Response> {
        try{
            const {employee_name,employee_email, employee_password } = req.body;
            const result = await employeeService.getEmployee(employee_email);
            if (result === null) {
                const createEmployee = await employeeService.createEmployee(employee_name,employee_email,employee_password)

                return res.status(200).json({ message : "Created successfully" });
            }
            return res.status(400).json({ message: 'Employee email exists' });
            
        } catch (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async handleUpdateEmployeeById(req: Request, res: Response) {}
    async handleDeleteEmployeeById(req: Request, res: Response) {}
}