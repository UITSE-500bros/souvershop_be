import { Request, Response } from 'express';
import ProductService from '~/services/product.service';

export class ProductController {

  async getAllProducts(Request: Request, Response: Response): Promise<Response> {
    try {
      const products = await ProductService.getAllProducts();
      return Response.status(200).json(products);
    } catch (err) {
      return Response.status(500).json({ error: 'Failed to retrieve products' });
    }
  }

  async getProductById(Request: Request, Response: Response): Promise<Response> {
    const { product_id } = Request.params;
    try {
      const product = await ProductService.getProduct(product_id);
      return Response.status(200).json(product);
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }

  async createProduct(Request: Request, Response: Response): Promise<Response> {
    try {
      const { 
        product_id, 
        category_id, 
        product_image, 
        product_describe, 
        product_selling_price, 
        product_import_price, 
        product_status, 
        is_sale, 
        percentage_sale 
      } = Request.body;
      const product = await ProductService.createProduct(
        product_id, 
        category_id, 
        product_image, 
        product_describe, 
        product_selling_price, 
        product_import_price, 
        product_status, 
        is_sale, 
        percentage_sale
      );
      return Response.status(201).json(product);
    } catch (err: any) {
      return Response.status(500).json({ error: 'Failed to create product' });
    }
  }

  async updateProduct(Request: Request, Response: Response): Promise<Response> {
    const { product_id } = Request.params;
    try {
      const { 
        category_id, 
        product_image, 
        product_describe, 
        product_selling_price, 
        product_import_price, 
        product_status, 
        is_sale, 
        percentage_sale 
      } = Request.body;
      const product = await ProductService.updateProduct(
        product_id, 
        category_id, 
        product_image, 
        product_describe, 
        product_selling_price, 
        product_import_price, 
        product_status, is_sale, 
        percentage_sale
      );
      return Response.status(200).json(product);
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }

  async deleteProduct(Request: Request, Response: Response): Promise<Response> {
    const { product_id } = Request.params;
    try {
      await ProductService.deleteProduct(product_id);
      return Response.status(204).send();
    } catch (err: any) {
      return Response.status(404).json({ error: err.message });
    }
  }
}

const productController = new ProductController;
export default productController;