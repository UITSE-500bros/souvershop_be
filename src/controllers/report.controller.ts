import { Request, Response } from 'express';
import ReportService from '../services/report.service';

export class ReportController {

  async getReport(req: Request, res: Response) {
    try {
      const report = await ReportService.getReport();
      return res.status(200).json(report);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  }
}

const reportController = new ReportController();
export default reportController;