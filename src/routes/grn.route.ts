import { Router } from 'express';
import {grnController} from '../controllers';
import authMiddleware from '../middleware/authorizeRole';

const grnRouter = Router();

grnRouter.get('/', grnController.getAllGRNs);
grnRouter.get('/:grn_id', grnController.getGRNById);
grnRouter.post('/', authMiddleware, grnController.createGRN);
grnRouter.put('/:grn_id', grnController.updateGRN);
grnRouter.delete('/:grn_id', grnController.deleteGRN);

export default grnRouter;