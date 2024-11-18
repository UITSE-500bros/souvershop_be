import { Router } from 'express';
import {grnController} from '../controllers';

const grnRouter = Router();

grnRouter.get('/grn', grnController.getAllGRNs);
grnRouter.get('/grn/:grn_id', grnController.getGRNById);
grnRouter.post('/grn', grnController.createGRN);
grnRouter.put('/grn/:grn_id', grnController.updateGRN);
grnRouter.delete('/grn/:grn_id', grnController.deleteGRN);

grnRouter.get('/grn/date/:date', grnController.getGRNsByDate);
grnRouter.get('/grn/month/:year/:month', grnController.getGRNsByMonth);
grnRouter.get('/grn/year/:year', grnController.getGRNsByYear);

export default grnRouter;