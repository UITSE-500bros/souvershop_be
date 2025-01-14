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

  async getProductsReport() {
    const productsReportQuery = `
      SELECT 
        (SELECT COUNT(*) FROM product) AS product_count,
        (SELECT COUNT(*) FROM category) AS category_count;
      `;
    const productsReportResult = await pool.query(productsReportQuery);
    return productsReportResult.rows[0];
  }
  // Doanh số
  async getRevenueReport() {
    const totalSalesReportQuery = `
      SELECT
          SUM(total_quantity) AS grand_total_quantity
      FROM (
          SELECT
              receipt_id,
              SUM((json_element->>'quantity')::INTEGER) AS total_quantity
          FROM (
              SELECT 
                  receipt_id,
                  unnest(product_list) AS json_element
              FROM receipt
          ) subquery
          GROUP BY receipt_id
      ) final_subquery;
    `;
    const salaryReportQuery = `
      SELECT 
          SUM(u.salary) AS total_salary
      FROM 
          public.user u
      JOIN 
          public.role_user ru ON u.user_id = ru.user_id
      WHERE 
          ru.role_id = 1;
    `;

    const grnReportQuery = ` 
      SELECT
          SUM(total) AS total_grn
      FROM
          grn;
    `;
    const grn_total = await pool.query(grnReportQuery);
    const salaryResult = await pool.query(salaryReportQuery);

    const profitReportQuery = `
      SELECT 
          (SUM(receipt.total) - ${salaryResult.rows[0].total_salary}- ${grn_total.rows[0].total_grn}) AS total_profit
      FROM 
          receipt
    `;

    const revenueReportQuery = `
      SELECT 
          SUM(receipt.total) AS total_revenue
      FROM 
          receipt;
    `;

    const revenueReportResult = await pool.query(revenueReportQuery);
    const profitReportResult = await pool.query(profitReportQuery);
    const salesReportResult = await pool.query(totalSalesReportQuery);
    const costReportResult = salaryResult.rows[0].total_salary + grn_total.rows[0].total_grn;

    return {
      total_revenue: revenueReportResult.rows[0].total_revenue,
      total_profit: profitReportResult.rows[0].total_profit,
      total_sales: salesReportResult.rows[0].grand_total_quantity,
      total_cost: costReportResult
    };

  }
  // Mua hàng
  async getPurchasesReport() {
    const purchasesReportQuery = `
      SELECT 
        (SELECT SUM(total) FROM grn) AS total_expense,
        (SELECT COUNT(*) FROM grn) AS total_purchase;
      `;
    const purchasesReportResult = await pool.query(purchasesReportQuery);
    return purchasesReportResult.rows[0];
  }

  // SL tồn kho thấp
  async getLowInventoryReport() {
    const feature_products = ['id', 'name', 'image', 'quantity'].map((item) => {
      return `product_${item}`;
    });

    const lowInventoryReportQuery = ` 
        SELECT ${feature_products.join(',')} FROM product 
        WHERE product_quantity <= 12
        ORDER BY product_quantity ASC;
    `;

    const lowInventoryReportResult = await pool.query(lowInventoryReportQuery);
    if (lowInventoryReportResult.rows.length === 0) {
      return { low_inventory_count: 0 };
    }
    return lowInventoryReportResult.rows;
  }

  async getStockReport() {
    const stockReportQuery = `
      SELECT 
        (SELECT SUM(product_quantity) FROM product) AS total_products,
        (SELECT
              SUM((product->>'quantity')::int) AS total_shipping_products
          FROM
              public.receipt
          CROSS JOIN LATERAL
              unnest(receipt.product_list) AS product_list_element(product)
          WHERE
              status = 'Đang giao hàng'  -- Filter by orders that are being delivered
              AND product_list IS NOT NULL  -- Ensure product_list is not null
              AND product_list_element.product->>'quantity' IS NOT NULL
        ) as total_shipping_products
    `;
    const stockReportResult = await pool.query(stockReportQuery);
    return stockReportResult.rows[0];

  }
  async getBuyReport() {
    const buyReportQuery = `
      SELECT 
        (SELECT COUNT(*) FROM grn) AS total_purchase,
        (SELECT SUM(total) FROM grn) AS total_expense,
        (SELECT SUM(total) FROM receipt
          WHERE status = 'Đã hủy'
        ) AS total_canceled,
        (SELECT SUM(total) FROM receipt
          WHERE status = 'Đã trả hàng'
        ) AS total_returned
    `;
    const buyReportResult = await pool.query(buyReportQuery);
    return buyReportResult.rows[0];

  }
  async getSellBuyReport() {

    const sellBuyReportQuery = `
      
    `;
    const sellBuyReportResult = await pool.query(sellBuyReportQuery);
    return sellBuyReportResult.rows[0];


  }
  async getOrdersReport() {
    const ordersReportQuery = `
      SELECT 
        (SELECT COUNT(*) FROM receipt) AS total_orders,
        (SELECT SUM(total) FROM receipt) AS total_revenue
    `;
    const ordersReportResult = await pool.query(ordersReportQuery);
    return ordersReportResult.rows[0];
  }

  async getSaleProductReport() {
    const saleProductReportQuery = `
      WITH sold_products AS (
          SELECT
              p.product_id,
              p.product_name,
              SUM((product_list_element->>'quantity')::int) AS total_sold_quantity,
              SUM((product_list_element->>'quantity')::int) * p.product_selling_price AS total_revenue
          FROM
              public.product p
          LEFT JOIN public.receipt r
              ON r.status = 'Đang giao hàng'
          LEFT JOIN LATERAL
              unnest(r.product_list) AS product_list_element(product_list_element)
              ON (product_list_element->>'product_id')::uuid = p.product_id
          GROUP BY
              p.product_id, p.product_name, p.product_selling_price
      ),
      stock_and_sales AS (
          SELECT
              p.product_name,
              COALESCE(sp.total_sold_quantity, 0) AS total_sold_quantity,
              p.product_quantity AS stock_remaining,
              COALESCE(sp.total_revenue, 0) AS total_revenue
          FROM
              public.product p
          LEFT JOIN sold_products sp
              ON p.product_id = sp.product_id
      )
      SELECT
          product_name,
          total_sold_quantity,
          stock_remaining,
          total_revenue
      FROM
          stock_and_sales
      WHERE
          total_sold_quantity > 0
      ORDER BY
          total_sold_quantity DESC, total_revenue DESC
      LIMIT 7;
    `;

    const saleProductReportResult = await pool.query(saleProductReportQuery);
    return saleProductReportResult.rows;
  }

  async getBestProductReport() {
    const bestProductReportQuery = `
      WITH product_sales AS (
          SELECT
              p.product_id,
              p.product_name,
              p.product_selling_price,
              p.product_quantity AS remaining_quantity,
              c.category_name,
              SUM(o.total) AS total_revenue,
              COUNT(o.receipt_id) AS times_sold,
              p.percentage_sale
          FROM
              public.product p
          LEFT JOIN
              public.category c ON p.category_id = c.category_id -- Join to get category name
          LEFT JOIN
              LATERAL (
                  SELECT
                      receipt_id,
                      total,
                      UNNEST(product_list)::jsonb ->> 'product_id' AS product_id_in_order
                  FROM
                      public.receipt
              ) o ON o.product_id_in_order::uuid = p.product_id -- Ensure casting to UUID
          GROUP BY
              p.product_id, p.product_name, p.product_selling_price, p.product_quantity,
              p.percentage_sale, c.category_name
      ),
      ranked_products AS (
          SELECT
              product_id,
              product_name,
              product_selling_price,
              remaining_quantity,
              category_name,
              total_revenue,
              times_sold,
              percentage_sale,
              RANK() OVER (ORDER BY total_revenue DESC) AS revenue_rank,
              RANK() OVER (ORDER BY times_sold DESC) AS sales_rank
          FROM
              product_sales
      )
      SELECT
          product_id,
          product_name,
          product_selling_price,
          remaining_quantity,
          category_name,
          total_revenue,
          times_sold,
          percentage_sale,
          revenue_rank,
          sales_rank
      FROM
          ranked_products
      WHERE
          times_sold > 0 -- Exclude products with no sales
      ORDER BY
          sales_rank, revenue_rank
      LIMIT 7;

    `;
    const bestProductReportResult = await pool.query(bestProductReportQuery);
    return bestProductReportResult.rows;
  }
  async getLineChartReport() {

  }
  async getInventoryReport() {
    const inventoryReportQuery = `
      SELECT 
        (SELECT COUNT(*) FROM product) AS product_count,
        (SELECT SUM(total) FROM receipt) AS revenue,
        (SELECT COUNT(*) FROM category) AS category_count
    `;
    const inventoryReportResult = await pool.query(inventoryReportQuery);
    return inventoryReportResult.rows[0];
  }

  async getCategoryReport() {
    const categoryReportQuery = `
      WITH category_sales AS (
        SELECT
            c.category_name,
            SUM(o.total) AS total_revenue, -- Tổng doanh số (doanh thu)
            COUNT(o.receipt_id) AS total_orders, -- Tổng số đơn hàng
            SUM((product_list_element->>'quantity')::int) AS total_sold_quantity -- Tổng số lượng sản phẩm bán được
        FROM
            public.category c
        LEFT JOIN
            public.product p ON c.category_id = p.category_id
        LEFT JOIN
            LATERAL (
                SELECT
                    receipt_id,
                    total,
                    UNNEST(product_list)::jsonb AS product_list_element
                FROM
                    public.receipt
            ) o ON (product_list_element->>'product_id')::uuid = p.product_id -- Liên kết sản phẩm trong receipt
        GROUP BY
            c.category_id, c.category_name
    )
    SELECT
        category_name,
        total_revenue,
        total_sold_quantity
    FROM
        category_sales
    WHERE
        total_sold_quantity > 0 -- Chỉ lấy danh mục có sản phẩm đã bán
    ORDER BY
        total_revenue DESC -- Sắp xếp theo doanh số từ cao xuống
    LIMIT 5;
    `;
    const categoryReportResult = await pool.query(categoryReportQuery);
    return categoryReportResult.rows;
  }
}

const reportService = new ReportService();
export default reportService;