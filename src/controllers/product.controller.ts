import { Request, Response } from 'express';
import ProductService from '../services/product.service';
import { AuthenticatedRequest } from 'src/middleware/authorizeRole';
export class ProductController {

  async getAllProducts(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const user_id = req.userId;
    try {
      const products = await ProductService.getAllProducts(user_id);
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
  }

  async getProductById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const user_id = req.userId;
    const { product_id } = req.params;
    try {
      const product = await ProductService.getProduct(product_id, user_id);
      return res.status(200).json(product);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const {
        category_id, 
        product_name, 
        product_import_price
      } = req.body;
      const product = await ProductService.createProduct(
        category_id, 
        product_name,
        product_import_price
      );
      return res.status(201).json(product);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<Response> {
    const { product_id } = req.params;
    try {
      const { 
        category_id, 
        product_name,
        product_image, 
        product_describe, 
        product_selling_price, 
        product_import_price, 
        product_quantity, 
        is_sale, 
        percentage_sale 
      } = req.body;
      const product = await ProductService.updateProduct(
        product_id, 
        category_id, 
        product_name,
        product_image, 
        product_describe, 
        product_selling_price, 
        product_import_price, 
        product_quantity, 
        is_sale, 
        percentage_sale
      );
      return res.status(200).json(product);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<Response> {
    const { product_id } = req.params;
    try {
      await ProductService.deleteProduct(product_id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async getAllInventories(req: Request, res: Response): Promise<Response> {
    try {
      const { page, page_size } = req.query;
      const inventories = await ProductService.getAllInventories(Number(page), Number(page_size));
      return res.status(200).json(inventories);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve inventories' });
    }
  }

  async getInventoryByProductId(req: Request, res: Response): Promise<Response> {
    const { product_id } = req.params;
    try {
      const inventory = await ProductService.getInventoryByProductId(product_id);
      return res.status(200).json(inventory);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async getProductsByCategoryId(req: Request, res: Response): Promise<Response> {
    const { category_id, user_id } = req.params; 
    try {
      const products = await ProductService.getProductsByCategoryId(Number(category_id), user_id);
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
  }
  async searchProductByName(req: Request, res: Response): Promise<Response> {
    const { product_name } = req.params;
    try {
      const products = await ProductService.searchProductByName(product_name);
      return res.status(200).json(products);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
  }
  async getRandomProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const product = await ProductService.getRandomProduct();
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to retrieve product' });
    }
  }
}

const productController = new ProductController();
export default productController;