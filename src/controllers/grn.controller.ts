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

    async getAllGRNs(res: Response) {
        try {
            const grns = await GRNService.getAllGRNs();
            return res.status(200).json(grns);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to fetch GRNs' });
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

    async getGRNsByDate(req: Request, res: Response): Promise<Response> {
        const { date } = req.params;
        try {
            const grns = await GRNService.getGRNsByDate(date);
            return res.status(200).json(grns);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getGRNsByMonth(req: Request, res: Response): Promise<Response> {
        const { year, month } = req.params; 
        try {
            const grns = await GRNService.getGRNsByMonth(parseInt(year), parseInt(month));
            return res.status(200).json(grns);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getGRNsByYear(req: Request, res: Response): Promise<Response> {
        const { year } = req.params; 
        try {
            const grns = await GRNService.getGRNsByYear(parseInt(year));
            return res.status(200).json(grns);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
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