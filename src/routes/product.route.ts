import { Router } from 'express';
import { productController } from '../controllers';
import authMiddleware from '../middleware/authorizeRole';
import ownerController from '../controllers/owner.controller';
const router = Router();

router.get('/search_random', productController.getRandomProduct);
router.get('/inventory', productController.getAllInventories);
router.get('/inventory/:product_id', productController.getInventoryByProductId);
router.post('/', productController.createProduct);
router.put('/discountevent', ownerController.createDiscount);
router.put('/:product_id', productController.updateProduct);
router.delete('/:product_id', productController.deleteProduct);
router.get('/search/:product_name', productController.searchProductByName);

router.get('/lookup', productController.getProductforLookup);
router.get('/:product_id',authMiddleware, productController.getProductById);
router.get('/',authMiddleware, productController.getAllProducts);


export default router;