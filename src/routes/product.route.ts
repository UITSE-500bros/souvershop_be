import { Router } from 'express';
import {productController} from '../controllers';

const router = Router();

router.get('/', productController.getAllProducts);
router.get('/inventory', productController.getAllInventories);
router.get('/inventory/:product_id', productController.getInventoryByProductId);
router.get('/:product_id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:product_id', productController.updateProduct);
router.delete('/:product_id', productController.deleteProduct);

// Thiếu get product by category_id
// Update getAllInventories cần name, main_img
// Change /inventories/:product_id return id, name, main_img, price, quantity

export default router;