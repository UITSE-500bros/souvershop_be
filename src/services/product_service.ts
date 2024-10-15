import { pool } from "~/utils/pool";

export class ProductService {
    async getProduct(product_id: string){
        const result = await pool.query('SELECT * FROM product WHERE product_id = $1', [product_id]);
        if (result.rows.length === 0) {
            throw new Error('Product not found');
        }
        return result.rows[0];
    }

    async getAllProducts(){
        const result = await pool.query('SELECT * FROM product');
        return result.rows;        
    }

    async createProduct(
        product_id: string,
        category_id: number,
        product_image: string[],
        product_describe: string,
        product_selling_price: number,
        product_import_price: number,
        product_status: number,
        is_sale: boolean,
        percentage_sale: number
    ) {
        const result = await pool.query(
            'INSERT INTO product (product_id, category_id, product_image, product_describe, product_selling_price, product_import_price, product_status, is_sale, percentage_sale, NOW(), NOW()) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [product_id, category_id, product_image, product_describe, product_selling_price, product_import_price, product_status, is_sale, percentage_sale]
        );
        return result.rows[0]; 
    }

    async updateProduct(
        product_id: string,
        category_id: number,
        product_image: string[],
        product_describe: string,
        product_selling_price: number,
        product_import_price: number,
        product_status: number,
        is_sale: boolean,
        percentage_sale: number
    ) {
        const result = await pool.query(
            'UPDATE product SET category_id = $2, product_image = $3, product_describe = $4, product_selling_price = $5, product_import_price = $6, product_status = $7, is_sale = $8, percentage_sale = $9, update_at = NOW() WHERE product_id = $1 RETURNING *',
            [product_id, category_id, product_image, product_describe, product_selling_price, product_import_price, product_status, is_sale, percentage_sale]
        );
        if (result.rows.length === 0) {
            throw new Error('Product not found');
        }
        return result.rows[0]; 
    }


    async deleteProduct(product_id: string){
        const result = await pool.query('DELETE FROM product WHERE product_id = $1 RETURNING *', [product_id]);
        if (result.rows.length === 0) {
            throw new Error('Product not found');
        }
        return result.rows[0];
    }
}