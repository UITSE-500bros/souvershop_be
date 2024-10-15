import { pool } from "~/utils/pool";

export class CategoryService {
    async getAllCategories() {
        const result = await pool.query('SELECT * FROM category');
        return result.rows;
    }

    async getCategoryById(categoryId: number) {
        const result = await pool.query('SELECT * FROM category WHERE category_id = $1', [categoryId]);
        if (result.rows.length === 0) {
            throw new Error('Category not found');
        }
        return result.rows[0];
    }

    async createCategory(categoryName: string) {
        const result = await pool.query(
            'INSERT INTO category (category_name) VALUES ($1) RETURNING *',
            [categoryName]
        );
        return result.rows[0];
    }

    async updateCategory(categoryId: number, categoryName: string) {
        const result = await pool.query(
            'UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *',
            [categoryName, categoryId]
        );
        if (result.rows.length === 0) {
            throw new Error('Category not found');
        }
        return result.rows[0];
    }

    async deleteCategory(categoryId: number) {
        const result = await pool.query('DELETE FROM category WHERE category_id = $1 RETURNING *', [categoryId]);
        if (result.rows.length === 0) {
            throw new Error('Category not found');
        }
        return result.rows[0];
    }
}