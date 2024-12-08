import { Router } from 'express';
import reviewController from '../controllers/review.controller';

const router = Router();

router.get('/', reviewController.getAllReviews);
router.get('/top', reviewController.getTopReviews);
router.get('/customer/:customer_id', reviewController.getReviewsByCustomerId);
router.get('/product/:product_id', reviewController.getReviewsByProductId);
router.post('/', reviewController.createReview);
router.put('/customer/:customer_id/receipt/:receipt_id/product/:product_id', reviewController.updateReview);
router.delete('/customer/:customer_id/receipt/:receipt_id/product/:product_id', reviewController.deleteReview);

// sortBy=rating&order=asc    sort rating từ 0-5 sao

// sortBy=rating&order=desc    sort rating từ 5-0 sao

// sortBy=time&order=newest    sort thời gian từ mới nhất tới cũ nhất

// sortBy=time&order=oldest     sort thời gian từ cũ nhất tới mới nhất

export default router;