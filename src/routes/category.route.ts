import { Router } from 'express';
import {categoryController, productController} from '../controllers';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.get('/:category_id', productController.getProductsByCategoryId);
router.post('/', categoryController.createCategory);
router.put('/:category_id', categoryController.updateCategory);
router.delete('/:category_id', categoryController.deleteCategory);

export default router;
