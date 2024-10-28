export default class Category {
  category_id: number; 
  category_name: string;  

  constructor(category_id: number, category_name: string) {
      this.category_id = category_id;
      this.category_name = category_name;
  }
}
