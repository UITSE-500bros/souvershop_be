import { EmployeeService } from "~/services";

export class EmployeeController {
    constructor(
        private employeeService: EmployeeService
    ){}

    async handleLogin(req: Request, res: Response) {}
    async handleGetAllEmployees(req: Request, res: Response) {}
    async handleCreateEmployeeById(req: Request, res: Response) {}
    async handleUpdateEmployeeById(req: Request, res: Response) {}
    async handleDeleteEmployeeById(req: Request, res: Response) {}
}