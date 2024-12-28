import { pool } from "../utils";
import moment from 'moment';

class ReportService {
  async getReport() {
    try {
      const grnQueryResult = await pool.query(
        `SELECT SUM(total) as grn_total, 
        COUNT(*) as grn_quantity 
        FROM grn`
      );
      const grnResult = grnQueryResult.rows[0];
      const grn_total = grnResult.grn_total !== null ? grnResult.grn_total.toString() : "0";
      const grn_quantity = grnResult.grn_quantity !== null ? grnResult.grn_quantity.toString() : "0";

      const receiptQueryResult = await pool.query(
        `SELECT SUM(total) as receipt_total, 
        COUNT(*) as receipt_quantity 
        FROM receipt`
      );
      const receiptResult = receiptQueryResult.rows[0];
      const receipt_total = receiptResult.receipt_total !== null ? receiptResult.receipt_total.toString() : "0";
      const receipt_quantity = receiptResult.receipt_quantity !== null ? receiptResult.receipt_quantity.toString() : "0";

      const categoryCountResult = await pool.query(
        `SELECT COUNT(*) as category_count 
        FROM category`
      );
      const category_count = categoryCountResult.rows[0]?.category_count?.toString() || "0";

      const totalQuantityResult = await pool.query(`
        SELECT SUM((item ->> 'quantity')::numeric) as buy_quantity
        FROM grn, json_array_elements(product_list) as item
      `);
      const buy_quantity = totalQuantityResult.rows[0]?.buy_quantity?.toString() || "0";

      return {
        buy_total: grn_total,
        sale_total: receipt_total,
        category_count,
        buy_quantity,
        grn_quantity,
        receipt_quantity,
      };
    } catch (error) {
      console.error('Error in ReportService.getReport:', error);
      throw new Error('Failed to generate report');
    }
  }

  async getReportByDateRange(beginDate: string, endDate: string) {
    try {
      // Đổi dạng ngày từ dd/mm/yyyy sang yyyy-mm-dd sử dụng moment.js
      const formattedBeginDate = moment(beginDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const formattedEndDate = moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const grnTotalQuery =
        `SELECT SUM(total) as grn_total, 
        COUNT(*) as grn_quantity 
        FROM grn 
        WHERE created_at 
        BETWEEN $1 AND $2`;
      const grnQueryResult = await pool.query(grnTotalQuery, [formattedBeginDate, formattedEndDate]);
      const grnResult = grnQueryResult.rows[0];
      const grn_total = grnResult.grn_total !== null ? grnResult.grn_total.toString() : "0";
      const grn_quantity = grnResult.grn_quantity !== null ? grnResult.grn_quantity.toString() : "0";

      const receiptTotalQuery =
        `SELECT SUM(total) as receipt_total, 
        COUNT(*) as receipt_quantity 
        FROM receipt 
        WHERE created_at 
        BETWEEN $1 AND $2`;
      const receiptQueryResult = await pool.query(receiptTotalQuery, [formattedBeginDate, formattedEndDate]);

      const receiptResult = receiptQueryResult.rows[0];
      const receipt_total = receiptResult.receipt_total !== null ? receiptResult.receipt_total.toString() : "0";
      const receipt_quantity = receiptResult.receipt_quantity !== null ? receiptResult.receipt_quantity.toString() : "0";

      const categoryCountResult = await pool.query('SELECT COUNT(*) as category_count FROM category');
      const category_count = categoryCountResult.rows[0]?.category_count?.toString() || "0";

      const totalQuantityQuery = `
        SELECT SUM((item ->> 'quantity')::numeric) as buy_quantity
        FROM grn, json_array_elements(product_list) as item
        WHERE grn.created_at BETWEEN $1 AND $2
      `;
      const totalQuantityResult = await pool.query(totalQuantityQuery, [formattedBeginDate, formattedEndDate]);
      const buy_quantity = totalQuantityResult.rows[0]?.buy_quantity?.toString() || "0";

      return {
        buy_total: grn_total,
        sale_total: receipt_total,
        category_count,
        buy_quantity,
        grn_quantity,
        receipt_quantity,
      };
    } catch (error) {
      console.error('Error in ReportService.getReportByDateRange:', error);
      throw new Error('Failed to generate report for the given date range');
    }
  }
}

const reportService = new ReportService();
export default reportService;