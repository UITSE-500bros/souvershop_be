import { Router } from 'express';
import { productController } from '../controllers';

const router = Router();

router.get('/inventory', productController.getAllInventories);
router.get('/inventory/:product_id', productController.getInventoryByProductId);

router.get('/category/:category_id/:user_id', productController.getProductsByCategoryId);

router.get('/:product_id/:user_id', productController.getProductById);

router.get('/:user_id', productController.getAllProducts);

router.post('/', productController.createProduct);
router.put('/:product_id', productController.updateProduct);
router.delete('/:product_id', productController.deleteProduct);

export default router;