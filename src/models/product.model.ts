export default class Product {
  product_id: string; 
  category_id: number;
  product_name: string;
  product_image: string[] | null = null; 
  product_describe: string | null = null; 
  product_selling_price: number;  
  product_import_price: number;  
  product_quantity: number; 
  is_sale: boolean | null = null; 
  percentage_sale: number | null = null;  
  create_at: Date;  
  update_at: Date;  

  constructor(
      product_id: string,
      category_id: number,
      product_name: string,
      product_image: string[] | null,
      product_describe: string | null,
      product_selling_price: number,
      product_import_price: number,
      product_quantity: number,
      is_sale: boolean | null,
      percentage_sale: number | null,
      create_at: Date,
      update_at: Date
  ) {
      this.product_id = product_id;
      this.category_id = category_id;
      this.product_name = product_name;
      this.product_image = product_image || null;
      this.product_describe = product_describe || null;
      this.product_selling_price = product_selling_price;
      this.product_import_price = product_import_price;
      this.product_quantity = product_quantity;
      this.is_sale = is_sale || null;
      this.percentage_sale = percentage_sale || null;
      this.create_at = create_at;
      this.update_at = update_at;
  }
}
