import { Request, Response } from 'express';
import Customer from '~/models/customer';
import { CustomerService } from '~/services';


export class CustomerController {
    constructor(
        private customerService: CustomerService
    ){}
    async login(Response: Response, Request: Request): Promise<Response> {
        const { customer_email, customer_password } = Request.body;
        const result = await this.customerService.getCustomer(customer_email);
        if (result.rows[0].customer_password !== customer_password) {
            throw new Error('Password incorrect');
        }
        return Response.status(200).json(result.rows[0]);
    }
    async register(Response: Response, Request: Request){
        const { customer_name,customer_email, customer_password, customer_address } = Request.body;
        // const CustomerData = new Customer(customer_name, customer_email, customer_password, customer_address) 
        // const result = await this.customerService.createCustomer(CustomerData);
        //return Response.status(200).json(result.rows[0]);
        
    }
    async update(Response: Response, Request: Request){
        // code here{
        
    }
    async delete(Response: Response, Request: Request){
        // code here{
        
    }
    
}