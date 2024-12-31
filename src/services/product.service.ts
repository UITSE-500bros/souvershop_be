import { pool } from "../utils";
import reviewService from "./review.service";
import Product from "../models/product.model";
import userService from "./user.service";

async function isProductFavourited(user_id: string, product_id: string): Promise<boolean> {
    const user = await userService.getUserByID(user_id);
    return user && user.favourite_list ? user.favourite_list.includes(product_id) : false;
}

class ProductService {
    
    async getProduct(product_id: string, user_id: string) {
        const productResult = await pool.query('SELECT * FROM product WHERE product_id = $1', [product_id]);
        if (productResult.rows.length === 0) {
            throw new Error('Product not found');
        }
        const product: Product = productResult.rows[0];

        const averageRating = await reviewService.getAverageRatingByProductId(product_id);
        const isFavourited = await isProductFavourited(user_id, product_id);

        const result = {
            ...product,
            average_rating: averageRating,
            is_favourited: isFavourited
        };

        return result;
    }

    async getAllProducts(user_id: string) {
        const productsResult = await pool.query('SELECT * FROM product');
        const products: Product[] = productsResult.rows;

        const result = await Promise.all(products.map(async (product) => {
            const averageRating = await reviewService.getAverageRatingByProductId(product.product_id);
            const isFavourited = await isProductFavourited(user_id, product.product_id);

            return {
                ...product,
                average_rating: averageRating,
                is_favourited: isFavourited
            };
        }));

        return result;
    }

    async createProduct(
        category_id: number,
        product_name: string,
        product_import_price: number
    ) {
        const result = await pool.query(
            `INSERT INTO product (
                category_id, 
                product_name, 
                product_import_price, 
                product_selling_price, 
                product_quantity, 
                create_at, 
                update_at
            ) VALUES ($1, $2, $3, $4, 0, NOW(), NOW()) 
            RETURNING *`,
            [
                category_id, 
                product_name, 
                product_import_price,
                Math.round(product_import_price * 1.25)
            ]
        );
        return result.rows[0]; 
    }

    async updateProduct(
        product_id: string,
        category_id: number,
        product_name:string,
        product_image: string[],
        product_describe: string,
        product_selling_price: number,
        product_import_price: number,
        product_quantity: number,
        is_sale: boolean,
        percentage_sale: number
    ) {
        const result = await pool.query(
            `UPDATE product 
            SET 
                category_id = $2, 
                product_name = $3, 
                product_image = $4, 
                product_describe = $5, 
                product_selling_price = $6, 
                product_import_price = $7, 
                product_quantity = $8, 
                is_sale = $9, 
                percentage_sale = $10, 
                update_at = NOW() 
            WHERE product_id = $1 
            RETURNING *`,
            [
                product_id, 
                category_id, 
                product_name, 
                product_image, 
                product_describe, 
                product_selling_price, 
                product_import_price, 
                product_quantity, 
                is_sale, 
                percentage_sale
            ]
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

    async getAllInventories(page: number, page_size: number) {
        const result = await pool.query(
            `
            SELECT *
            FROM product
            ORDER BY create_at DESC
            LIMIT ${page_size}
            OFFSET (${page} - 1) * ${page_size};

            `
        );
        console.log(result.rows);
        return result.rows;
    }
    
    async getInventoryByProductId(product_id: string) {
        const result = await pool.query(
            `SELECT 
                product_id,
                product_name,
                (product_image->0) as main_img,
                product_import_price,
                product_selling_price,
                product_quantity
            FROM product 
            WHERE product_id = $1`,
            [product_id]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Product not found');
        }
        
        return result.rows[0];
    }

    async getProductsByCategoryId(category_id: number, user_id: string) {
        const productsResult = await pool.query('SELECT * FROM product WHERE category_id = $1', [category_id]);
        const products: Product[] = productsResult.rows;

        const result = await Promise.all(products.map(async (product) => {
            const averageRating = await reviewService.getAverageRatingByProductId(product.product_id);
            const isFavourited = await isProductFavourited(user_id, product.product_id);

            return {
                ...product,
                average_rating: averageRating,
                is_favourited: isFavourited
            };
        }));

        return result;
    }

}

const productService = new ProductService;
export default productService