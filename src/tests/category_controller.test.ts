import { Request, Response } from 'express';
import CategoryController from '~/controllers/category_controller';
import CategoryService from '~/services/category_service';

jest.mock('~/services/category_service');

const mockCategoryService = CategoryService as jest.Mocked<typeof CategoryService>;

describe('CategoryController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {

    jest.clearAllMocks();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
      send: jest.fn(),
    };
  });

  describe('getAllCategories', () => {
    it('should return all categories with status 200', async () => {
      const mockCategories = [
        { category_id: 1, category_name: 'Category 1' },
        { category_id: 2, category_name: 'Category 2' },
      ];

      mockCategoryService.getAllCategories.mockResolvedValue(mockCategories);

      const controller = CategoryController;
      await controller.getAllCategories(req as Request, res as Response);

      expect(mockCategoryService.getAllCategories).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockCategories);
    });

    it('should handle errors and return status 500', async () => {
      mockCategoryService.getAllCategories.mockRejectedValue(new Error('Database error'));

      const controller = CategoryController;
      await controller.getAllCategories(req as Request, res as Response);

      expect(mockCategoryService.getAllCategories).toHaveBeenCalledTimes(1);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return the category with status 200', async () => {
      const mockCategory = { category_id: 1, category_name: 'Category 1' };
      mockCategoryService.getCategoryById.mockResolvedValue(mockCategory);

      req = {
        params: { category_id: '1' },
      };

      const controller = CategoryController;
      await controller.getCategoryById(req as Request, res as Response);

      expect(mockCategoryService.getCategoryById).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockCategory);
    });

    it('should return 404 if category not found', async () => {
      mockCategoryService.getCategoryById.mockRejectedValue(new Error('Category not found'));

      req = {
        params: { category_id: '999' },
      };

      const controller = CategoryController;
      await controller.getCategoryById(req as Request, res as Response);

      expect(mockCategoryService.getCategoryById).toHaveBeenCalledWith(999);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('createCategory', () => {
    it('should create a new category and return it with status 201', async () => {
      const newCategory = { category_id: 3, category_name: 'Category 3' };
      mockCategoryService.createCategory.mockResolvedValue(newCategory);

      req = {
        body: { category_name: 'Category 3' },
      };

      const controller = CategoryController;
      await controller.createCategory(req as Request, res as Response);

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith('Category 3');
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(newCategory);
    });

    it('should return 500 if creation fails', async () => {
      mockCategoryService.createCategory.mockRejectedValue(new Error('Failed to create category'));

      req = {
        body: { category_name: 'Category 4' },
      };

      const controller = CategoryController;
      await controller.createCategory(req as Request, res as Response);

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith('Category 4');
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to create category' });
    });
  });

  describe('updateCategory', () => {
    it('should update the category and return it with status 200', async () => {
      const updatedCategory = { category_id: 1, category_name: 'Updated Category' };
      mockCategoryService.updateCategory.mockResolvedValue(updatedCategory);

      req = {
        params: { category_id: '1' },
        body: { category_name: 'Updated Category' },
      };

      const controller = CategoryController;
      await controller.updateCategory(req as Request, res as Response);

      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(1, 'Updated Category');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedCategory);
    });

    it('should return 404 if category to update is not found', async () => {
      mockCategoryService.updateCategory.mockRejectedValue(new Error('Category not found'));

      req = {
        params: { category_id: '999' },
        body: { category_name: 'Non-existent Category' },
      };

      const controller = CategoryController;
      await controller.updateCategory(req as Request, res as Response);

      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(999, 'Non-existent Category');
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });

  describe('deleteCategory', () => {
    it('should delete the category and return status 204', async () => {
      mockCategoryService.deleteCategory.mockResolvedValue({ category_id: 1, category_name: 'Category 1' });

      req = {
        params: { category_id: '1' },
      };

      const controller = CategoryController;
      await controller.deleteCategory(req as Request, res as Response);

      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(1);
      expect(res.send).toHaveBeenCalledWith();
      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it('should return 404 if category to delete is not found', async () => {
      mockCategoryService.deleteCategory.mockRejectedValue(new Error('Category not found'));

      req = {
        params: { category_id: '999' },
      };

      const controller = CategoryController;
      await controller.deleteCategory(req as Request, res as Response);

      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(999);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Category not found' });
    });
  });
});
