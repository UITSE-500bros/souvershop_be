export default class Inventory {
  product_id: string;
  product_quantity: number;

  constructor(
    product_id: string,
    product_quantity: number
  ) {
    this.product_id = product_id;
    this.product_quantity = product_quantity;
  }
}