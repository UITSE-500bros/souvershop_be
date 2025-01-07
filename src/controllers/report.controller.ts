import { Request, Response } from 'express';
import ReportService from '../services/report.service';
import moment from 'moment'; 

class ReportController {
  async getReport(req: Request, res: Response) {
    try {
      // kiểm tra xem có truyền tham số begin và end không
      const beginDate = req.query.begin as string | undefined;
      const endDate = req.query.end as string | undefined;

      if (beginDate && endDate) {
        // kiểm tra format ngày
        if (!moment(beginDate, 'DD/MM/YYYY', true).isValid() || !moment(endDate, 'DD/MM/YYYY', true).isValid()) {
          return res.status(400).json({ error: 'Invalid date format. Use dd/MM/yyyy.' });
        }


        const report = await ReportService.getReportByDateRange(beginDate, endDate);
        return res.status(200).json(report);
      } else {

        const report = await ReportService.getReport();
        return res.status(200).json(report);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  async productsReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getProductsReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  async revenueReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getRevenueReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  async lowStockReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getLowInventoryReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }
  //summary stock

  async stockReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getStockReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }
  //summary buy 

  async buyReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getBuyReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  //summary sell & buy ( bar chart )
  async sellBuyReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getSellBuyReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  //summary orders
  async ordersReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getOrdersReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  //best product's sell
  async bestProductReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getBestProductReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

  // line chart
  async lineChartReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getLineChartReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }
  async inventoryReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getInventoryReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }

}

const reportController = new ReportController();
export default reportController;