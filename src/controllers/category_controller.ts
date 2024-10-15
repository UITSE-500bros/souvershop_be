import { Request, Response } from 'express';
import { CategoryService } from '~/services';

export class CategoryController {
  constructor(
    private categoryService: CategoryService
  ) {}

  async getAllCategories(Request: Request, Response: Response): Promise<Response> {
    try {
      const categories = await this.categoryService.getAllCategories();
      return Response.status(200).json(categories);
    } catch (err) {
      return Response.status(500).json({ error: 'Failed to retrieve categories' });
    }
  }

  async getCategoryById(Request: Request, Response: Response): Promise<Response> {
    const { category_id } = Request.params;
    try {
      const category = await this.categoryService.getCategoryById(Number(category_id));
      return Response.status(200).json(category);
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }

  async createCategory(Request: Request, Response: Response): Promise<Response> {
    const { category_name } = Request.body;
    try {
      const newCategory = await this.categoryService.createCategory(category_name);
      return Response.status(201).json(newCategory);
    } catch (err: any) {
      return Response.status(500).json({ error: 'Failed to create category' });
    }
  }

  async updateCategory(Request: Request, Response: Response): Promise<Response> {
    const { category_id } = Request.params;
    const { category_name } = Request.body;
    try {
      const updatedCategory = await this.categoryService.updateCategory(Number(category_id), category_name);
      return Response.status(200).json(updatedCategory);
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }

  async deleteCategory(Request: Request, Response: Response): Promise<Response> {
    const { category_id } = Request.params;
    try {
      await this.categoryService.deleteCategory(Number(category_id));
      return Response.status(204).send();
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }
}
