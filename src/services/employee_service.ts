import Employee from "~/models/employee";
import { pool } from "~/utils/pool";

class EmployeeService{
    async getEmployee(employee_email: string):Promise<Employee>{
        const result = await pool.query('SELECT ')
        if(result.rows.length === 0){
            return null as unknown as Employee;
        }
        return result.rows[0];
    }
    async getAllEmployees():Promise<Employee[]> {
        const result = await pool.query('SELECT * FROM employee')
        if(result.rows.length === 0){
            return null as unknown as Employee[];
        }
        return result.rows;
    }
    async createEmployee(employee_name: string, employee_email: string, employee_password: string){

    }
    async updateEmployee(employee_id: number, employee_name: string, employee_email: string, employee_password: string, employee_address: string){}
    async deleteEmployee(employee_id: number){}
}

const employeeService = new EmployeeService
export default employeeService