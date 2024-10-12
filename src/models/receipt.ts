import payment_method from "~/utils/payment_method";

export default class Receipt{
    receipt_id: string;
    customer_id: string;
    total: number;
    create_at: Date;
    update_at: Date;
    creater_id: string;
    payment_method: payment_method;
    constructor(receipt_id: string, customer_id: string, total: number, create_at: Date, update_at: Date, creater_id: string,payment_method: payment_method){ 
        this.receipt_id = receipt_id;
        this.customer_id = customer_id;
        this.total = total;
        this.create_at = create_at;
        this.update_at = update_at;
        this.creater_id = creater_id;
        this.payment_method = payment_method;
    }

}