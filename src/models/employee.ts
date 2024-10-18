export default class Employee {
    employee_id? : string;
    employee_name : string;
    employee_email : string;
    employee_password : string;
    create_at: Date;
    update_at: Date;

    constructor(employee_name: string, employee_email: string, employee_password: string, create_at: Date, update_at: Date, employee_id?: string) {
        if(employee_id !== undefined){
            this.employee_id = employee_id
        }
        this.employee_name = employee_name;
        this.employee_email = employee_email;
        this.employee_password = employee_password;
        this.create_at = create_at;
        this.update_at = update_at;
    }
}