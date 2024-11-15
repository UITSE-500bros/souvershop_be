import { Request, Response } from 'express';
import CategoryService from '~/services/category.service';

class CategoryController {

  async getAllCategories(req: Request,Response: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      return Response.status(200).json(categories);
    } catch (err) {
      console.log(err);
    }
  }

  async getCategoryById(Request: Request, Response: Response): Promise<Response> {
    const { category_id } = Request.params;
    try {
      const category = await CategoryService.getCategoryById(Number(category_id));
      return Response.status(200).json(category);
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }

  async createCategory(Request: Request, Response: Response): Promise<Response> {
    const { category_name } = Request.body;
    try {
      const newCategory = await CategoryService.createCategory(category_name);
      return Response.status(201).json(newCategory);
    } catch (err: any) {
      return Response.status(500).json({ error: 'Failed to create category' });
    }
  }

  async updateCategory(Request: Request, Response: Response): Promise<Response> {
    const { category_id } = Request.params;
    const { category_name } = Request.body;
    try {
      const updatedCategory = await CategoryService.updateCategory(Number(category_id), category_name);
      return Response.status(200).json(updatedCategory);
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }

  async deleteCategory(Request: Request, Response: Response): Promise<Response> {
    const { category_id } = Request.params;
    try {
      await CategoryService.deleteCategory(Number(category_id));
      return Response.status(204).send();
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }
}

const categoryController = new CategoryController();
export default categoryController;