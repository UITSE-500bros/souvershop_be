import {Router , Request , Response} from 'express';
import {
  handleGetAllProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct
} from '../controllers/product_controller';

const router = Router();

router.get('/product', handleGetAllProducts);
router.get('/product/:product_id', handleGetProductById);
router.post('/product', handleCreateProduct);
router.put('/product/:product_id', handleUpdateProduct);
router.delete('/product/:product_id', handleDeleteProduct);

export default router;
