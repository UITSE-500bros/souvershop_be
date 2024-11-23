import { Request, Response } from 'express';
import GRNService from '../services/grn.service';

class GRNController {
    private readonly EDIT_TIME_LIMIT_MINUTES = 15;

    private async isEditableGRN(grnId: string): Promise<boolean> {
        const grn = await GRNService.getGRNById(grnId);
        const createdAt = new Date(grn.created_at);
        const now = new Date();
        const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
        return diffInMinutes <= this.EDIT_TIME_LIMIT_MINUTES;
    }

    async getAllGRNs(req: Request, res: Response): Promise<Response> {
        try {
            const { year, month, day } = req.query;
            
            if (year && isNaN(Number(year))) {
                return res.status(400).json({ error: 'Invalid year format' });
            }
            if (month && (isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12)) {
                return res.status(400).json({ error: 'Invalid month format' });
            }
            if (day && (isNaN(Number(day)) || Number(day) < 1 || Number(day) > 31)) {
                return res.status(400).json({ error: 'Invalid day format' });
            }

            let grns: any;
            
            if (year && month && day) {
                grns = await GRNService.getGRNsByDate(Number(year), Number(month), Number(day));
            } else if (year && month) {
                grns = await GRNService.getGRNsByMonth(Number(year), Number(month));
            } else if (year) {
                grns = await GRNService.getGRNsByYear(Number(year));
            } else {
                grns = await GRNService.getAllGRNs();
            }

            return res.status(200).json(grns);
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    async getGRNById(req: Request, res: Response): Promise<Response> {
        const { grn_id } = req.params;
        try {
            const grn = await GRNService.getGRNById(grn_id);
            return res.status(200).json(grn);
        } catch (err: any) {
            return res.status(404).json({ error: err.message });
        }
    }

    async createGRN(req: Request, res: Response): Promise<Response> {
        const { total, creater_id, product_list } = req.body;
        try {
            const newGRN = await GRNService.createGRN(total, creater_id, product_list);
            return res.status(201).json(newGRN);
        } catch (err: any) {
            return res.status(500).json({ error: 'Failed to create GRN' });
        }
    }

    async updateGRN(req: Request, res: Response): Promise<Response> {
        const { grn_id } = req.params;
        const { total, product_list } = req.body;
        try {
            // Kiểm tra thời gian chỉnh sửa
            const isEditable = await this.isEditableGRN(grn_id);
            if (!isEditable) {
                return res.status(403).json({ 
                    error: 'GRN can only be edited within 15 minutes of creation' 
                });
            }

            const updatedGRN = await GRNService.updateGRN(grn_id, total, product_list);
            return res.status(200).json(updatedGRN);
        } catch (err: any) {
            return res.status(404).json({ error: err.message });
        }
    }

    async deleteGRN(req: Request, res: Response): Promise<Response> {
        const { grn_id } = req.params;
        try {
            await GRNService.deleteGRN(grn_id);
            return res.status(204).send();
        } catch (err: any) {
            return res.status(404).json({ error: err.message });
        }
    }
}

const grnController = new GRNController();
export default grnController;