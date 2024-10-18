import { Router } from 'express';
import categoryController from '~/controllers/category_controller';

const router = Router();

router.get('/category', categoryController.getAllCategories);
router.get('/category/:category_id', categoryController.getCategoryById);
router.post('/category', categoryController.createCategory);
router.put('/category/:category_id', categoryController.updateCategory);
router.delete('/category/:category_id', categoryController.deleteCategory);

export default router;
