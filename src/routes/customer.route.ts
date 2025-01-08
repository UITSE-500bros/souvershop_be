import { Router } from 'express';
import { customerController } from '../controllers';
import authMiddleware from '../middleware/authorizeRole';

const router = Router();

router.get('/cart', authMiddleware, customerController.getAllCartItems);
router.post('/cart', authMiddleware, customerController.addToCart);
router.put('/cart/:product_id', authMiddleware, customerController.editCartItem);
router.delete('/cart/:product_id', authMiddleware, customerController.removeFromCart);

router.get('/favourite', authMiddleware, customerController.getAllFavourites);
router.post('/favourite', authMiddleware, customerController.addToFavourites);
router.delete('/favourite', authMiddleware, customerController.removeFromFavourites);



router.delete('/cancel_order/:orderId', authMiddleware, customerController.cancelOrder);

router.get('/orders', authMiddleware, customerController.getOrders);
export default router;