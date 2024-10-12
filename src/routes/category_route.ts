import { Router } from 'express';
import {
  handleGetAllCategories,
  handleGetCategoryById,
  handleCreateCategory,
  handleUpdateCategory,
  handleDeleteCategory
} from '../controllers/category_controller';

const router = Router();

router.get('/category', handleGetAllCategories);
router.get('/category/:category_id', handleGetCategoryById);
router.post('/category', handleCreateCategory);
router.put('/category/:category_id', handleUpdateCategory);
router.delete('/category/:category_id', handleDeleteCategory);

export default router;
