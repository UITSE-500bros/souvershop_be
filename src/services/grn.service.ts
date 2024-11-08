import { pool } from "~/utils/pool";
import ProductList from "~/models/product_list.model";

class GRNService {
    private readonly EDIT_TIME_LIMIT_MINUTES = 15;

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

    async createGRN(total: number, createrId: string, productList: ProductList[]) {
        const result = await pool.query(
            `INSERT INTO grn (total, created_at, creater_id, product_list)
            VALUES ($1, NOW(), $2, $3)
            RETURNING *`,
            [total, createrId, JSON.stringify(productList)]
        );
        return result.rows[0];
    }

    async isEditableGRN(grnId: string): Promise<boolean> {
        const result = await pool.query(
            `SELECT created_at FROM grn WHERE grn_id = $1`,
            [grnId]
        );

        if (result.rows.length === 0) {
            throw new Error('GRN not found');
        }

        const createdAt = new Date(result.rows[0].created_at);
        const now = new Date();
        const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

        return diffInMinutes <= this.EDIT_TIME_LIMIT_MINUTES;
    }

    async updateGRN(grnId: string, total: number, productList: ProductList[]) {
        // Kiểm tra GRN còn trong 15m
        const isEditable = await this.isEditableGRN(grnId);
        if (!isEditable) {
            throw new Error('GRN can only be edited within 15 minutes of creation');
        }

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