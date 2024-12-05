import { Router } from 'express';
import receiptController from '../controllers/receipt.controller';


const router = Router();
router.post('/create_payment_url', receiptController.createPaymentUrl);
router.get('/vnpay_return', receiptController.vnpReturn);
export default router;