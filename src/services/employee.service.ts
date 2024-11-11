import { User } from "~/models";
import { pool } from "~/utils/pool";

class EmployeeService {
    async getEmployee() {
        const result = await pool.query('SELECT * FROM user WHERE role = 2');
        return result.rows;
    }
    async getEmployeeById(employee_id: string) {
        const result = await pool.query('SELECT * FROM user WHERE user_id = $1 AND role = 2', [employee_id]);
        if (result.rows.length === 0) {
            throw new Error('Employee not found');
        }
        return result.rows[0];
    }
    async createEmployee() {

    }
    async updateEmployeeSalary(employee_id: string, salary: number) {

    }
    async updateEmployeePosition(employee_id: string, position: string) {

    }
    async updateEmployeeInformation(employee: User) {
        

    }
    async deleteEmployee(employee_id: string) {

    }
}