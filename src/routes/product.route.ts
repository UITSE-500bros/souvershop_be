import { Router } from 'express';
import { productController } from '../controllers';

const router = Router();

router.get('/inventory', productController.getAllInventories);
router.get('/inventory/:product_id', productController.getInventoryByProductId);
router.get('/:product_id', productController.getProductById);
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:product_id', productController.updateProduct);
router.delete('/:product_id', productController.deleteProduct);

export default router;