import { Request, Response } from 'express';
import { customerService } from '~/services';
class CustomerController {
    async login(Response: Response, Request: Request): Promise<Response> {
        const { customer_email, customer_password } = Request.body;
        const result = await customerService.getCustomer(customer_email);
        if (result.rows[0].customer_password !== customer_password) {
            throw new Error('Password incorrect');
        }
        return Response.status(200).json(result.rows[0]);
    }
    async register(Response: Response, Request: Request){
        const { customer_name,customer_email, customer_password, customer_address } = Request.body;
        const result = await customerService.createCustomer(customer_name,customer_email, customer_password, customer_address);
        return Response.status(200).json(result.rows[0]);
    }
    async update(Response: Response, Request: Request){
        const { customer_id, customer_name,customer_email, customer_password, customer_address } = Request.body;
        if( await customerService.getCustomer(customer_email) === null){
            throw new Error('Customer not found');
        }
        const result = await customerService.updateCustomer(customer_id, customer_name,customer_email, customer_password, customer_address);
        return Response.status(200).json(result.rows[0]);
    }
    async delete(Response: Response, Request: Request){
        const { customer_id,customer_email } = Request.body;
        if( await customerService.getCustomer(customer_email) === null){
            throw new Error('Customer not found');
        }
        const result = await customerService.deleteCustomer(customer_id);
        return Response.status(200).json(result.rows[0]);
    }
    
}

const customerController = new CustomerController;
export default customerController