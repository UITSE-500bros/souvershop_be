

export default class ReceiptDetail{
    receipt_id: string;
    product_id: string;
    quantity: number;

    constructor(receipt_id: string, product_id:string, quantity:number){
        this.receipt_id=receipt_id;
        this.product_id=product_id;
        this.quantity=quantity
    }
}