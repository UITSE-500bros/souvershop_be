import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../type';
import { receiptService } from '../services';

class EmployeeController {
    async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
        const { orderId, status } = req.body;
        // Update order status
        try{
            const result = await receiptService.updateOrderStatus(orderId, status);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: (error as Error).message });
        }
    }
    async updateProfile(req: Request, res: Response) {}
    async getProfile(req: Request, res: Response) {}
    async getOrders(req: Request, res: Response) {
        // Get all orders
        try {
            const result = await receiptService.getOrders();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: (error as Error).message });
        }
    }
    async getOrderDetail(req: Request, res: Response) {}

}
const employeeController = new EmployeeController();
export default employeeController;