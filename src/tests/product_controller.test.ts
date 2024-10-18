// tests/product_controller.test.ts
import { Request, Response } from 'express';
import ProductController from '~/controllers/product_controller';
import ProductService from '~/services/product_service';

jest.mock('~/services/product_service');

const mockProductService = ProductService as jest.Mocked<typeof ProductService>;

describe('ProductController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {

    jest.clearAllMocks();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    sendMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };
  });

  describe('getAllProducts', () => {
    it('should return all products with status 200', async () => {
      const mockProducts = [
        { product_id: '1', product_name: 'Product 1' },
        { product_id: '2', product_name: 'Product 2' },
      ];

      mockProductService.getAllProducts.mockResolvedValue(mockProducts);

      const controller = ProductController;
      await controller.getAllProducts(req as Request, res as Response);

      expect(mockProductService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle errors and return status 500', async () => {
      mockProductService.getAllProducts.mockRejectedValue(new Error('Database error'));

      const controller = ProductController;
      await controller.getAllProducts(req as Request, res as Response);

      expect(mockProductService.getAllProducts).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to retrieve products' });
    });
  });

  describe('getProductById', () => {
    it('should return the product with status 200', async () => {
      const mockProduct = { product_id: '1', product_name: 'Product 1' };
      mockProductService.getProduct.mockResolvedValue(mockProduct);

      req = {
        params: { product_id: '1' },
      };

      const controller = ProductController;
      await controller.getProductById(req as Request, res as Response);

      expect(mockProductService.getProduct).toHaveBeenCalledWith('1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      mockProductService.getProduct.mockRejectedValue(new Error('Product not found'));

      req = {
        params: { product_id: '999' },
      };

      const controller = ProductController;
      await controller.getProductById(req as Request, res as Response);

      expect(mockProductService.getProduct).toHaveBeenCalledWith('999');
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('createProduct', () => {
    it('should create a new product and return it with status 201', async () => {
      const newProduct = {
        product_id: '3',
        category_id: 1,
        product_image: ['image1.jpg'],
        product_describe: 'New product',
        product_selling_price: 100,
        product_import_price: 80,
        product_status: 1,
        is_sale: true,
        percentage_sale: 10,
      };
      mockProductService.createProduct.mockResolvedValue(newProduct);

      req = {
        body: newProduct,
      };

      const controller = ProductController;
      await controller.createProduct(req as Request, res as Response);

      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        newProduct.product_id,
        newProduct.category_id,
        newProduct.product_image,
        newProduct.product_describe,
        newProduct.product_selling_price,
        newProduct.product_import_price,
        newProduct.product_status,
        newProduct.is_sale,
        newProduct.percentage_sale
      );
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(newProduct);
    });

    it('should return 500 if creation fails', async () => {
      mockProductService.createProduct.mockRejectedValue(new Error('Failed to create product'));

      req = {
        body: {
          product_id: '4',
          category_id: 2,
          product_image: ['image2.jpg'],
          product_describe: 'Another product',
          product_selling_price: 150,
          product_import_price: 120,
          product_status: 1,
          is_sale: false,
          percentage_sale: 0,
        },
      };

      const controller = ProductController;
      await controller.createProduct(req as Request, res as Response);

      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        req.body.product_id,
        req.body.category_id,
        req.body.product_image,
        req.body.product_describe,
        req.body.product_selling_price,
        req.body.product_import_price,
        req.body.product_status,
        req.body.is_sale,
        req.body.percentage_sale
      );
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to create product' });
    });
  });

  describe('updateProduct', () => {
    it('should update the product and return it with status 200', async () => {
      const updatedProduct = {
        product_id: '1',
        category_id: 2,
        product_image: ['image_updated.jpg'],
        product_describe: 'Updated product',
        product_selling_price: 120,
        product_import_price: 90,
        product_status: 1,
        is_sale: true,
        percentage_sale: 15,
      };
      mockProductService.updateProduct.mockResolvedValue(updatedProduct);

      req = {
        params: { product_id: '1' },
        body: updatedProduct,
      };

      const controller = ProductController;
      await controller.updateProduct(req as Request, res as Response);

      expect(mockProductService.updateProduct).toHaveBeenCalledWith(
        '1',
        updatedProduct.category_id,
        updatedProduct.product_image,
        updatedProduct.product_describe,
        updatedProduct.product_selling_price,
        updatedProduct.product_import_price,
        updatedProduct.product_status,
        updatedProduct.is_sale,
        updatedProduct.percentage_sale
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedProduct);
    });

    it('should return 404 if product to update is not found', async () => {
      mockProductService.updateProduct.mockRejectedValue(new Error('Product not found'));

      req = {
        params: { product_id: '999' },
        body: {
          category_id: 3,
          product_image: ['image3.jpg'],
          product_describe: 'Non-existent product',
          product_selling_price: 200,
          product_import_price: 150,
          product_status: 0,
          is_sale: false,
          percentage_sale: 0,
        },
      };

      const controller = ProductController;
      await controller.updateProduct(req as Request, res as Response);

      expect(mockProductService.updateProduct).toHaveBeenCalledWith(
        '999',
        req.body.category_id,
        req.body.product_image,
        req.body.product_describe,
        req.body.product_selling_price,
        req.body.product_import_price,
        req.body.product_status,
        req.body.is_sale,
        req.body.percentage_sale
      );
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product and return status 204', async () => {
      mockProductService.deleteProduct.mockResolvedValue({
        product_id: '1',
        product_name: 'Product 1',
      });

      req = {
        params: { product_id: '1' },
      };

      const controller = ProductController;
      await controller.deleteProduct(req as Request, res as Response);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith('1');
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should return 404 if product to delete is not found', async () => {
      mockProductService.deleteProduct.mockRejectedValue(new Error('Product not found'));

      req = {
        params: { product_id: '999' },
      };

      const controller = ProductController;
      await controller.deleteProduct(req as Request, res as Response);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith('999');
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Product not found' });
    });
  });
});
