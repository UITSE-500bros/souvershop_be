import { Request, Response } from 'express';
import CategoryService from '../services/category.service';

class CategoryController {

 async getAllCategories(req: Request, res: Response) {
   try {
     const categories = await CategoryService.getAllCategories();
     return res.status(200).json(categories);
   } catch (err) {
     console.log(err);
     return res.status(500).json({ error: 'Failed to get categories' });
   }
 }

 async getCategoryById(req: Request, res: Response): Promise<Response> {
   const { category_id } = req.params;
   try {
     const category = await CategoryService.getCategoryById(Number(category_id));
     return res.status(200).json(category);
   } catch (err: any) {
     return res.status(404).json({ error: err.message });
   }
 }

 async createCategory(req: Request, res: Response): Promise<Response> {
   const { category_name } = req.body;
   try {
     const newCategory = await CategoryService.createCategory(category_name);
     return res.status(201).json(newCategory);
   } catch (err: any) {
     return res.status(500).json({ error: 'Failed to create category' });
   }
 }

 async updateCategory(req: Request, res: Response): Promise<Response> {
   const { category_id } = req.params;
   const { category_name } = req.body;
   try {
     const updatedCategory = await CategoryService.updateCategory(Number(category_id), category_name);
     return res.status(200).json(updatedCategory);
   } catch (err: any) {
     return res.status(404).json({ error: err.message });
   }
 }

 async deleteCategory(req: Request, res: Response): Promise<Response> {
   const { category_id } = req.params;
   try {
     await CategoryService.deleteCategory(Number(category_id));
     return res.status(204).send();
   } catch (err: any) {
     return res.status(404).json({ error: err.message });
   }
 }
}

const categoryController = new CategoryController();
export default categoryController;