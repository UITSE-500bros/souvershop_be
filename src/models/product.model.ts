export default class Product {
  product_id: string; 
  category_id: number;
  product_name:string;
  product_image: string[]; 
  product_describe: string; 
  product_selling_price: number;  
  product_import_price: number;  
  product_quantity: number; 
  is_sale: boolean; 
  percentage_sale: number;  
  create_at: Date;  
  update_at: Date;  

  constructor(
      product_id: string,
      category_id: number,
      product_name:string,
      product_image: string[],
      product_describe: string,
      product_selling_price: number,
      product_import_price: number,
      product_quantity: number,
      is_sale: boolean,
      percentage_sale: number,
      create_at: Date,
      update_at: Date
  ) {
      this.product_id = product_id;
      this.category_id = category_id;
      this.product_name = product_name;
      this.product_image = product_image;
      this.product_describe = product_describe;
      this.product_selling_price = product_selling_price;
      this.product_import_price = product_import_price;
      this.product_quantity = product_quantity;
      this.is_sale = is_sale;
      this.percentage_sale = percentage_sale;
      this.create_at = create_at;
      this.update_at = update_at;
  }
}
