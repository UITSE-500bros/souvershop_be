import { pool } from "../utils";

class ReportService {
  async getReport() {
    try {
      const grnTotalResult = await pool.query('SELECT SUM(total) as grn_total FROM grn');
      const buy_total = grnTotalResult.rows[0].grn_total || "0";

      const receiptTotalResult = await pool.query('SELECT SUM(total) as receipt_total FROM receipt');
      const sale_total = receiptTotalResult.rows[0].receipt_total || "0";

      const categoryCountResult = await pool.query('SELECT COUNT(*) as category_count FROM category');
      const category_count = categoryCountResult.rows[0].category_count || "0";

      const totalQuantityResult = await pool.query(`
        SELECT SUM((item ->> 'quantity')::numeric) as total_quantity
        FROM grn, json_array_elements(product_list) as item
      `);
      const total_quantity = totalQuantityResult.rows[0].total_quantity || "0";

      return {
        buy_total,
        sale_total,
        category_count,
        total_quantity,
      };
    } catch (error) {
      console.error('Error in ReportService.getReport:', error);
      throw new Error('Failed to generate report');
    }
  }

  async getReportByDateRange(beginDate: string, endDate: string) {
    try {
      // đổi dạng ngày từ dd/mm/yyyy sang yyyy-mm-dd
      const formattedBeginDate = this.formatDateForPostgres(beginDate);
      const formattedEndDate = this.formatDateForPostgres(endDate);

      const grnTotalQuery = `SELECT SUM(total) as grn_total FROM grn WHERE created_at BETWEEN $1 AND $2`;
      const grnTotalResult = await pool.query(grnTotalQuery, [formattedBeginDate, formattedEndDate]);
      const buy_total = grnTotalResult.rows[0].grn_total || "0";

      const receiptTotalQuery = `SELECT SUM(total) as receipt_total FROM receipt WHERE created_at BETWEEN $1 AND $2`;
      const receiptTotalResult = await pool.query(receiptTotalQuery, [formattedBeginDate, formattedEndDate]);
      const sale_total = receiptTotalResult.rows[0].receipt_total || "0";

      const categoryCountResult = await pool.query('SELECT COUNT(*) as category_count FROM category');
      const category_count = categoryCountResult.rows[0].category_count || "0";

      const totalQuantityQuery = `
        SELECT SUM((item ->> 'quantity')::numeric) as total_quantity
        FROM grn, json_array_elements(product_list) as item
        WHERE grn.created_at BETWEEN $1 AND $2
      `;
      const totalQuantityResult = await pool.query(totalQuantityQuery, [formattedBeginDate, formattedEndDate]);
      const total_quantity = totalQuantityResult.rows[0].total_quantity || "0";

      return {
        buy_total,
        sale_total,
        category_count,
        total_quantity,
      };
    } catch (error) {
      console.error('Error in ReportService.getReportByDateRange:', error);
      throw new Error('Failed to generate report for the given date range');
    }
  }

  // hàm đổi dạng ngày từ dd/mm/yyyy sang yyyy-mm-dd
  private formatDateForPostgres(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
}

const reportService = new ReportService();
export default reportService;