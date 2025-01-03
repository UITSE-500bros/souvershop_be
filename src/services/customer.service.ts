import { pool } from "../utils";
import { ProductList } from "../models";


class CustomerService {
    async getCustomer() {
        const result = await pool.query('SELECT * FROM user WHERE role = 1');
        return result.rows;
    }
    async getCustomerById(customer_id: string) {
        const result = await pool.query('SELECT * FROM user WHERE user_id = $1 AND role = 1', [customer_id]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }
        return result.rows[0];
    }

    async updatePersonalInfo(customer_id: string) {
        const result = await pool.query('SELECT * FROM user WHERE user_id = $1 AND role = 1', [customer_id]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }

        // UPDATE
    }

    async updatePassword(customer_id: string) {
        const result = await pool.query('SELECT * FROM user WHERE user_id = $1 AND role = 1', [customer_id]);
        if (result.rows.length === 0) {
            throw new Error('Customer not found');
        }

        // UPDATE
    }

    async getAllCartItems(customerId: string) {

        const userResult = await pool.query('SELECT product_list FROM "user" WHERE user_id = $1', [customerId]);
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
        const productList: ProductList[] = userResult.rows[0].product_list || [];

        const cartItems = await Promise.all(productList.map(async (item) => {
          const productResult = await pool.query(`
            SELECT product_id, product_name, product_image, product_selling_price, is_sale
            FROM product 
            WHERE product_id = $1
          `, [item.product_id]);
    
          if (productResult.rows.length === 0) {
            return null;
          }
    
          const product = productResult.rows[0];
          return {
            ...product,
            quantity: item.quantity,
          };
        }));

        return cartItems;
      }
    
      async addToCart(
        user_id: string,
        product_id: string,
        quantity: number
      ): Promise<ProductList[]> {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
      
          const userResult = await client.query(
            'SELECT product_list FROM "user" WHERE user_id = $1 FOR UPDATE',
            [user_id]
          );
      
          if (userResult.rows.length === 0) {
            throw new Error('User not found');
          }
      
          let productList: ProductList[] = userResult.rows[0].product_list || [];
          productList.forEach((item) => {
            item.quantity = parseInt(item.quantity.toString());
          });
      
          const productResult = await client.query(
            'SELECT product_quantity FROM product WHERE product_id = $1',
            [product_id]
          );
      
          if (productResult.rows.length === 0) {
            throw new Error('Product not found');
          }
      
          const availableQuantity = parseInt(productResult.rows[0].product_quantity);
      
          const existingProductIndex = productList.findIndex(
            (item) => item.product_id === product_id
          );
      
          if (existingProductIndex !== -1) {
            if (productList[existingProductIndex].quantity + quantity > availableQuantity) {
              throw new Error('Insufficient product quantity');
            }
            productList[existingProductIndex].quantity += quantity;
          } else {
            productList.push(new ProductList(product_id, quantity));
          }
      
          await client.query(
            'UPDATE "user" SET product_list = $1 WHERE user_id = $2',
            [productList, user_id] 
          );
      
          await client.query(
            'UPDATE product SET product_quantity = product_quantity - $1 WHERE product_id = $2',
            [quantity, product_id]
          );
      
          await client.query('COMMIT');
          return productList;
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      }
    
      async editCartItem(customerId: string, productId: string, newQuantity: number) {
        const productResult = await pool.query('SELECT product_quantity FROM product WHERE product_id = $1', [productId]);
        if (productResult.rows.length === 0) {
            throw new Error('Product not found');
        }
        const availableQuantity = productResult.rows[0].product_quantity;
      
        if (newQuantity <= 0) {
            throw new Error("New quantity must be greater than 0");
        }
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
      
            const userResult = await client.query('SELECT product_list FROM "user" WHERE user_id = $1 FOR UPDATE', [customerId]);
            if (userResult.rows.length === 0) {
                throw new Error('User not found');
            }
            const productList: ProductList[] = userResult.rows[0]?.product_list || [];
      
            const existingProductIndex = productList.findIndex(item => item.product_id === productId);
            if (existingProductIndex === -1) {
                throw new Error('Product not found in cart');
            }
      
            const oldQuantity = productList[existingProductIndex].quantity;
            const quantityDifference = newQuantity - oldQuantity;
      
            if (quantityDifference > availableQuantity) {
                throw new Error("Insufficient product quantity");
            }
      
            productList[existingProductIndex].quantity = newQuantity;
            await client.query('UPDATE "user" SET product_list = $1 WHERE user_id = $2', [productList, customerId]);
            await client.query('UPDATE product SET product_quantity = product_quantity - $1 WHERE product_id = $2', [quantityDifference, productId]);
      
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
      }
    
      async removeFromCart(customerId: string, productId: string) {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
      
          const userResult = await client.query('SELECT product_list FROM "user" WHERE user_id = $1', [customerId]);
          if (userResult.rows.length === 0) {
            throw new Error('User not found');
          }
          const productList: ProductList[] = userResult.rows[0]?.product_list || [];
      
          const existingProductIndex = productList.findIndex(item => item.product_id === productId);
          if (existingProductIndex === -1) {
            throw new Error('Product not found in cart');
          }
      
          const removedQuantity = productList[existingProductIndex].quantity;
      
          productList.splice(existingProductIndex, 1);
      
          await client.query('UPDATE "user" SET product_list = $1 WHERE user_id = $2', [productList, customerId]);
          await client.query('UPDATE product SET product_quantity = product_quantity + $1 WHERE product_id = $2', [removedQuantity, productId]);
      
          await client.query('COMMIT');
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        } finally {
          client.release();
        }
      }
    
      async getAllFavourites(user_id: string) {
        const userResult = await pool.query('SELECT favourite_list FROM "user" WHERE user_id = $1', [user_id]);
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
    
        const favouriteList: string[] = userResult.rows[0].favourite_list || [];
    
        if (favouriteList.length === 0) {
          return [];
        }
    
        const productsResult = await pool.query(
          `SELECT product_id, product_name, product_image, product_selling_price, is_sale
           FROM product
           WHERE product_id = ANY($1)`,
          [favouriteList]
        );
    
        return productsResult.rows;
      }
    
      async addToFavourites(user_id: string, product_id: string) {
        const productCheck = await pool.query('SELECT 1 FROM product WHERE product_id = $1', [product_id]);
        if (productCheck.rows.length === 0) {
          throw new Error('Product not found');
        }
      
        const userResult = await pool.query(
          'SELECT favourite_list FROM "user" WHERE user_id = $1',
          [user_id]
        );
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
      
        let favouriteList: string[] = userResult.rows[0].favourite_list || [];
      
        if (!favouriteList.includes(product_id)) {
          favouriteList.push(product_id);
      
          await pool.query(
            `UPDATE "user"
             SET favourite_list = array_append(favourite_list, $1::json)
             WHERE user_id = $2`,
            [JSON.stringify(product_id), user_id]
          );
        }
      }
    
      async removeFromFavourites(user_id: string, product_id: string) {
      
        const userResult = await pool.query(
          'SELECT favourite_list FROM "user" WHERE user_id = $1',
          [user_id]
        );
      
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
      
        let favouriteList: string[] = userResult.rows[0].favourite_list || [];
        favouriteList = favouriteList.filter((id) => id !== product_id);
      
        const jsonArray = favouriteList.map((id) => `"${id}"`);
      
        await pool.query(
          `UPDATE "user" SET favourite_list = $1 WHERE user_id = $2`,
          [jsonArray, user_id]
        );
      
      }
}

const customerService = new CustomerService();
export default customerService;