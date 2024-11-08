import { pool } from "~/utils/pool";

class InventoryService {
  async getAllInventories() {
    const result = await pool.query(
      'SELECT product_id, product_quantity FROM product'
    );
    return result.rows;
  }

  async getInventoryByProductId(product_id: string) {
    const result = await pool.query(
      'SELECT product_id, product_quantity FROM product WHERE product_id = $1',
      [product_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Product not found');
    }
    
    return result.rows[0];
  }
}

const inventoryService = new InventoryService();
export default inventoryService;