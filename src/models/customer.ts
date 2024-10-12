import { ProductItem } from './product_item';

export default class Customer {
  customer_id: string;  
  customer_name: string;  
  customer_email: string;  
  customer_password: string; 
  customer_address: string; 
  create_at: Date;  
  update_at: Date;  
  product_list: ProductItem[];  

  constructor(
      customer_id: string,
      customer_name: string,
      customer_email: string,
      customer_password: string,
      customer_address: string,
      create_at: Date,
      update_at: Date,
      product_list: ProductItem[]
  ) {
      this.customer_id = customer_id;
      this.customer_name = customer_name;
      this.customer_email = customer_email;
      this.customer_password = customer_password;
      this.customer_address = customer_address;
      this.create_at = create_at;
      this.update_at = update_at;
      this.product_list = product_list;
  }
}
