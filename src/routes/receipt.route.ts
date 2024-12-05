import { Router } from 'express';
import receiptController from '../controllers/receipt.controller';


const router = Router();
router.post('/create_payment_url', receiptController.createPaymentUrl);
export default router;