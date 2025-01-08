import {ProductList} from "../models";
import { pool } from "../utils";

class GRNService {
    async getAllGRNs() {
        const result = await pool.query(
            'SELECT * FROM grn ORDER BY created_at DESC'
        );
        if (result.rows.length === 0) {
            return [];
        }
        return result.rows;
    }

    async getGRNById(grnId: string) {
        const result = await pool.query(
            'SELECT * FROM grn WHERE grn_id = $1',
            [grnId]
        );
        if (result.rows.length === 0) {
            throw new Error('GRN not found');
        }
        return result.rows[0];
    }

    async getGRNsByDate(year: number, month: number, day: number) {
        const result = await pool.query(
            `SELECT * FROM grn 
            WHERE EXTRACT(YEAR FROM created_at) = $1 
            AND EXTRACT(MONTH FROM created_at) = $2
            AND EXTRACT(DAY FROM created_at) = $3
            ORDER BY created_at DESC`,
            [year, month, day]
        );
        return result.rows;
    }

    async getGRNsByMonth(year: number, month: number) {
        const result = await pool.query(
            `SELECT * FROM grn 
            WHERE EXTRACT(YEAR FROM created_at) = $1 
            AND EXTRACT(MONTH FROM created_at) = $2
            ORDER BY created_at DESC`,
            [year, month]
        );
        return result.rows;
    }

    async getGRNsByYear(year: number) {
        const result = await pool.query(
            `SELECT * FROM grn 
            WHERE EXTRACT(YEAR FROM created_at) = $1
            ORDER BY created_at DESC`,
            [year]
        );
        return result.rows;
    }

    async createGRN(total: number, createrId: string, productList: ProductList[]) {
        const result = await pool.query(
            `INSERT INTO grn (total, created_at,,updated_at, creater_id, product_list,grn_status)
            VALUES ($1, NOW(),NOW(), $2, $3,'TRUE)
            RETURNING *`,
            [total, createrId, JSON.stringify(productList)]
        );
        return result.rows[0];
    }

    async updateGRN(grnId: string, total: number, productList: ProductList[]) {
        const result = await pool.query(
            `UPDATE grn
            SET total = $1,
                update_at = NOW(),
                product_list = $2
            WHERE grn_id = $3
            RETURNING *`,
            [total, JSON.stringify(productList), grnId]
        );

        if (result.rows.length === 0) {
            throw new Error('GRN not found');
        }
        return result.rows[0];
    }

    async deleteGRN(grnId: string) {
        const result = await pool.query(
            'DELETE FROM grn WHERE grn_id = $1 RETURNING *',
            [grnId]
        );
        if (result.rows.length === 0) {
            throw new Error('GRN not found');
        }
        return result.rows[0];
    }
}

const grnService = new GRNService();
export default grnService;