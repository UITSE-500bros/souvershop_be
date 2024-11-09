import { Router } from 'express';
import productController from '~/controllers/product.controller';

const router = Router();

router.get('/product', productController.getAllProducts);
router.get('/product/:product_id', productController.getProductById);
router.post('/product', productController.createProduct);
router.put('/product/:product_id', productController.updateProduct);
router.delete('/product/:product_id', productController.deleteProduct);
router.get('/product/inventories', productController.getAllInventories);
router.get('/product/inventories/:product_id', productController.getInventoryByProductId);

export default router;
