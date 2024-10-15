import Customer from "~/models/customer";
import ProductList from "~/models/product_list";
import { pool } from "~/utils/pool";

export class CustomerService {
    async getCustomer(customer_email: string){
        // code here{
        const result = await pool.query('SELECT customer FROM customer WHERE customer_email = $1', [customer_email]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }
        return result;
    }
    async getAllCustomer(){
        const result = await pool.query('SELECT * FROM customer ');
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }
        return result;
        
    }
    async createCustomer(customerData: Customer){
        // code here{
        const create_at = new Date();
        const update_at = new Date();
        const { 
            customer_name, 
            customer_email, 
            customer_password, 
            customer_address,
        } = customerData;
        const result = await pool.query(
            'INSERT INTO customer (customer_id, customer_name, customer_email, customer_password, time_start_working) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [customer_name, customer_email, customer_password, customer_address, create_at, update_at]
        );
        return result.rows[0];
    }
    async deleteCustomer(customer_id: string){
        const result = await pool.query('DELETE FROM customer WHERE customer_id = $1 RETURNING *', [customer_id]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }
        return result.rows[0];
    }
}