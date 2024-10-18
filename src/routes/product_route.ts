import { Router } from 'express';
import productController from '~/controllers/product_controller';

const router = Router();

router.get('/product', productController.getAllProducts);
router.get('/product/:product_id', productController.getProductById);
router.post('/product', productController.createProduct);
router.put('/product/:product_id', productController.updateProduct);
router.delete('/product/:product_id', productController.deleteProduct);

export default router;
