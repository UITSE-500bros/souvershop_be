import { pool } from "~/utils/pool";

class CustomerService {
    async getCustomer() {
        const result = await pool.query('SELECT * FROM user WHERE role = 1');
        return result.rows;
    }
    async getCustomerById(customer_id: string) {
        const result = await pool.query('SELECT * FROM user WHERE user_id = $1 AND role = 1', [customer_id]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }
        return result.rows[0];
    }

    async updatePersonalInfo(customer_id: string) {
        const result = await pool.query('SELECT * FROM user WHERE user_id = $1 AND role = 1', [customer_id]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }

        // UPDATE
    }

    async updatePassword(customer_id: string) {
        const result = await pool.query('SELECT * FROM user WHERE user_id = $1 AND role = 1', [customer_id]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }

        // UPDATE
    }


    
}

const customerService = new CustomerService();
export default customerService;