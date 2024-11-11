import customerService from "~/services/customer.service";
import { Request, Response } from 'express';

class CustomerController {
    async getCustomer(req: Request, res: Response) {
        try{
            const customerList = await customerService.getCustomer();
            return res.status(200).json(customerList);
        } catch (err) {
            console.log(err);
        }
        
    }
    
    async getCustomerById(req: Request, res: Response) {
        const { customer_id } = req.params;
        try {
            const customer = await customerService.getCustomerById(customer_id);
            return res.status(200).json(customer);
        } catch (err: any) {
            return res.status(404).json({ error: err.message });
        }
    }

    async updatePersonalInfo(req: Request, res: Response) {
        const { customer_id, customerName } = req.params;
        try {
            const updatedCustomer = await customerService.updatePersonalInfo(customer_id);
            return res.status(200).json(updatedCustomer);
        } catch (err: any) {
            return res.status(404).json({ error: err.message });
        }
    }


}