import { Request, Response } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/category_service';

export const handleGetAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

export const handleGetCategoryById = async (req: Request, res: Response) => {
  const { category_id } = req.params;
  
  try {
    const category = await getCategoryById(Number(category_id));
    res.status(200).json(category);
  } catch (err:any) {
    res.status(404).json({ error: err.message });
  }
};

export const handleCreateCategory = async (req: Request, res: Response) => {
  const { category_name } = req.body;

  try {
    const newCategory = await createCategory(category_name);
    res.status(201).json(newCategory);
  } catch (err:any) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const handleUpdateCategory = async (req: Request, res: Response) => {
  const { category_id } = req.params;
  const { category_name } = req.body;

  try {
    const updatedCategory = await updateCategory(Number(category_id), category_name);
    res.status(200).json(updatedCategory);
  } catch (err:any) {
    res.status(404).json({ error: err.message });
  }
};

export const handleDeleteCategory = async (req: Request, res: Response) => {
  const { category_id } = req.params;

  try {
    await deleteCategory(Number(category_id));
    res.status(204).send();
  } catch (err:any) {
    res.status(404).json({ error: err.message });
  }
};
