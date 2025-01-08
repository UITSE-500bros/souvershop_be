import { Router } from 'express';
import reviewController from '../controllers/review.controller';
import { authMiddleware } from '../middleware';

const router = Router();

router.get('/', reviewController.getAllReviews);
router.get('/top', reviewController.getTopReviews);
router.get('/customer/:customer_id', reviewController.getReviewsByCustomerId);
router.get('/product/:product_id', reviewController.getReviewsByProductId);
router.post('/', authMiddleware,reviewController.createReview);
router.put('/customer/:customer_id/receipt/:receipt_id/product/:product_id', reviewController.updateReview);
router.delete('/customer/:customer_id/receipt/:receipt_id/product/:product_id', reviewController.deleteReview);
export default router;