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

    async createGRN(createrId: string, productList: ProductList[]) {
        let total = 0;
        for (const product of productList) {
            total += product.product_total;
        }

        const result = await pool.query(
            `INSERT INTO grn (total, created_at, creater_id, product_list, grn_status)
            VALUES ($1, NOW(), $2, $3, false)
            RETURNING *`,
            [total, createrId, JSON.stringify(productList)]
        );
        const newGRN = result.rows[0];

        setTimeout(async () => {
            await this.importProduct(newGRN.grn_id);
        }, 15 * 60 * 1000);

        return newGRN;
    }

    async updateGRN(grnId: string, total: number, productList: ProductList[], grnStatus: boolean) {
        const result = await pool.query(
            `UPDATE grn
            SET total = $1,
                update_at = NOW(),
                product_list = $2,
                grn_status = $3
            WHERE grn_id = $4
            RETURNING *`,
            [total, JSON.stringify(productList), grnStatus, grnId]
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

    async importProduct(grnId: string) {
        const client = await pool.connect(); 
        try {
            await client.query('BEGIN');

            const grn = await this.getGRNById(grnId);

            if (!grn.grn_status) {
                await client.query(
                    `UPDATE grn SET grn_status = true, update_at = NOW() WHERE grn_id = $1`,
                    [grnId]
                );

                for (const product of grn.product_list) {
                    await client.query(
                        `UPDATE product SET product_quantity = product_quantity + $1, update_at = NOW() WHERE product_id = $2`,
                        [product.quantity, product.product_id]
                    );
                }

                await client.query('COMMIT');
                console.log(`GRN ${grnId} updated successfully.`);
            } else {
                console.log(`GRN ${grnId} was already updated.`);
            }
        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error(`Error updating GRN ${grnId}:`, error);
        } finally {
            client.release(); 
        }
    }
}

const grnService = new GRNService();
export default grnService;