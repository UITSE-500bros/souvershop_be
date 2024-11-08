import { Request, Response } from 'express';
import GRNService from '~/services/grn.service';

class GRNController {
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
            const updatedGRN = await GRNService.updateGRN(grn_id, total, product_list);
            return res.status(200).json(updatedGRN);
        } catch (err: any) {
            if (err.message.includes('15 minutes')) {
                return res.status(403).json({ error: err.message });
            }
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