export default class GRN_Detail{
    grn_id: string;
    product_id: string;
    quantity: number;
    price: number;

    constructor(grn_id: string, product_id: string, quantity: number, price: number) {
        this.grn_id = grn_id;
        this.product_id = product_id;
        this.quantity = quantity;
        this.price = price;
    }
}