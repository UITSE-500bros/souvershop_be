import { Router } from 'express';
import receiptController from '../controllers/receipt.controller';
import { authMiddleware } from '../middleware';



const router = Router();
router.post('/create_payment_url',authMiddleware, receiptController.createPaymentUrl);
router.post('/payment-return', receiptController.getReturn);
router.post('/cod',authMiddleware, receiptController.cashonDeilvery);
export default router;