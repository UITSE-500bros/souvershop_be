import { Router } from 'express';
import { reportController } from '../controllers';
const router = Router();

router.get('/', reportController.getReport);

// có thể query để lọc theo khoảng ngày ví dụ ?begin=01/01/2024&end=31/01/2024
// cần truyền đúng format ngày dd/mm/yyyy
// hoặc không truyền gì để lấy toàn bộ

// các field json như sau
// buy_total: tổng tiền nhập hàng
// sale_total: tổng tiền bán hàng
// category_count: số lượng danh mục
// buy_quantity: số lượng hàng đã nhập
// grn_quantity: số lượng phiếu nhập hàng
// receipt_quantity: số lượng hóa đơn

// không có số lượng hàng đã bán vì không có product_list trong bảng receipt
router.get('/products', reportController.productsReport);
router.get('/revenue', reportController.revenueReport);
router.get("/low-stock", reportController.lowStockReport);
router.get("/summary-stock", reportController.stockReport);
router.get("/buyreport", reportController.buyReport);
router.get("/sell_buy", reportController.sellBuyReport);
router.get("/orders", reportController.ordersReport);
router.get("/best_sallers", reportController.bestProductReport);
router.get("/linecharts", reportController.lineChartReport);
router.get("/inventory-report", reportController.inventoryReport);
router.get("/category_report", reportController.getCategoryReport);
router.get("/sales_product", reportController.salesProductReport);

export default router;