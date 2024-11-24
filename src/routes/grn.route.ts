import { Router } from 'express';
import {grnController} from '../controllers';

const grnRouter = Router();

grnRouter.get('/', grnController.getAllGRNs);
grnRouter.get('/:grn_id', grnController.getGRNById);
grnRouter.post('/', grnController.createGRN);
grnRouter.put('/:grn_id', grnController.updateGRN);
grnRouter.delete('/:grn_id', grnController.deleteGRN);

export default grnRouter;