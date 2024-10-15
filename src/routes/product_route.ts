import { Router } from 'express';
import { ProductController } from '~/controllers/product_controller';
import { ProductService } from '~/services/product_service';

const router = Router();
const productController = new ProductController(new ProductService());

router.get('/product', productController.getAllProducts);
router.get('/product/:product_id', productController.getProductById);
router.post('/product', productController.createProduct);
router.put('/product/:product_id', productController.updateProduct);
router.delete('/product/:product_id', productController.deleteProduct);

export default router;
