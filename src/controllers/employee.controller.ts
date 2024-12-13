import { Request, Response } from 'express';

class EmployeeController {
    async updateOrderStatus(req: Request, res: Response) {}
    async updateProfile(req: Request, res: Response) {}
    async getProfile(req: Request, res: Response) {}
    async getOrders(req: Request, res: Response) {}
    async getOrderDetail(req: Request, res: Response) {}

}
const employeeController = new EmployeeController();
export default employeeController;