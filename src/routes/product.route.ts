import { Router } from 'express';
import { productController } from '../controllers';
import authMiddleware from '../middleware/authorizeRole';
const router = Router();

router.get('/inventory', productController.getAllInventories);
router.get('/inventory/:product_id', productController.getInventoryByProductId);
router.get('/:product_id',authMiddleware, productController.getProductById);
router.get('/',authMiddleware, productController.getAllProducts);
router.post('/', productController.createProduct);
router.put('/:product_id', productController.updateProduct);
router.delete('/:product_id', productController.deleteProduct);
router.get('/search/:product_name', productController.searchProductByName);
router.get('/random',authMiddleware, productController.getRandomProduct);

export default router;