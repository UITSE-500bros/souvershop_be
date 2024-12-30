import { User } from "../models";
import { supabase } from "../utils";

class EmployeeService {
    async getEmployee() {

    }
    async getEmployeeById(employee_id: string) {

    }

    async updateEmployeeSalary(employee_id: string, salary: number) {

    }
    async updateEmployeePosition(employee_id: string, position: string) {

    }
    async updateEmployeeInformation(employee: User) {


    }
    async deleteEmployee(employee_id: string) {
        const response = await Promise.all([
            supabase.from('grns')
                .delete()
                .eq('user_id', employee_id),
            supabase.from('users')
                .delete()
                .eq('user_id', employee_id)
        ]);
        
        return response;
    }
}
const employeeService = new EmployeeService();
export default employeeService;