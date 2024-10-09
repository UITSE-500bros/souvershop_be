export default class Employee_type{
    employee_type: number;
    employee_type_name: string;
    create_at: Date;
    update_at: Date;

    constructor(employee_type: number, employee_type_name: string, create_at: Date, update_at: Date) {
        this.employee_type = employee_type;
        this.employee_type_name = employee_type_name;
        this.create_at = create_at;
        this.update_at = update_at;
    }
}