import { Router } from 'express';
import { customerController } from '../controllers';
import authMiddleware from '../middleware/authorizeRole';

const router = Router();

router.get('/cart', authMiddleware, customerController.getAllCartItems);
router.post('/cart', authMiddleware, customerController.addToCart);
router.put('/cart', authMiddleware, customerController.editCartItem);
router.delete('/cart', authMiddleware, customerController.removeFromCart);

export default router;
