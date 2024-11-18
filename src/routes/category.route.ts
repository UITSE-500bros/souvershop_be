import { Router } from 'express';
import {categoryController} from '../controllers';

const router = Router();

router.get('/', categoryController.getAllCategories);
router.get('/category/:category_id', categoryController.getCategoryById);
router.post('/createcategory', categoryController.createCategory);
router.put('/category/:category_id', categoryController.updateCategory);
router.delete('/category/:category_id', categoryController.deleteCategory);

export default router;
