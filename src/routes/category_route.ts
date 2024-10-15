import { Router } from 'express';
import { CategoryController } from '~/controllers/category_controller';
import { CategoryService } from '~/services/category_service';

const router = Router();
const categoryController = new CategoryController(new CategoryService());

router.get('/category', categoryController.getAllCategories);
router.get('/category/:category_id', categoryController.getCategoryById);
router.post('/category', categoryController.createCategory);
router.put('/category/:category_id', categoryController.updateCategory);
router.delete('/category/:category_id', categoryController.deleteCategory);

export default router;
