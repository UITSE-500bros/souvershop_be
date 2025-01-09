import { pool } from "../utils";

class Ownerservice {
    async createDiscountevent(discount_value: number, event_name: string, begin: Date, end: Date) {
        const query = `UPDATE product 
            SET 
                is_sale = true, 
                percentage_sale = ${discount_value}, 
                update_at = NOW()
            RETURNING *`;
        const res = await pool.query(query);
        return res;
    }
}
const ownerservice = new Ownerservice;
export default ownerservice;