import { Router } from 'express';
import grnController from '~/controllers/grn.controller';

const router = Router();

router.get('/grn', grnController.getAllGRNs);
router.get('/grn/:grn_id', grnController.getGRNById);
router.post('/grn', grnController.createGRN);
router.put('/grn/:grn_id', grnController.updateGRN);
router.delete('/grn/:grn_id', grnController.deleteGRN);

export default router;