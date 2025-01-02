export default class ProductList {
    product_id: string;
    quantity: number;
    product_total?: number;
    constructor(product_id: string, quantity: number, product_total?: number) {
        this.product_id = product_id;
        this.quantity = quantity;
        this.product_total = product_total;
    }
}