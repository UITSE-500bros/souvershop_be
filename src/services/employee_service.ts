import { pool } from "~/utils/pool";

export class EmployeeService{
    async getEmployee(employee_email: string){}
    async getAllEmployees(){}
    async createEmployee(employee_name: string, employee_email: string, employee_password: string, employee_address: string){}
    async updateEmployee(employee_id: number, employee_name: string, employee_email: string, employee_password: string, employee_address: string){}
    async deleteEmployee(employee_id: number){}
}