import { Router } from 'express';
import {productController} from '../controllers';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/inventories', productController.getAllInventories);
router.get('/inventories/:product_id', productController.getInventoryByProductId);
router.get('/:product_id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:product_id', productController.updateProduct);
router.delete('/:product_id', productController.deleteProduct);

export default router;