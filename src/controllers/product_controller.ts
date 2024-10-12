import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../services/product_service';

export const handleGetAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

export const handleGetProductById = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const product = await getProductById(product_id);
    res.status(200).json(product);
  } catch (err:any) {
    res.status(404).json({ error: err.message });
  }
};

export const handleCreateProduct = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err:any) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const handleUpdateProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const product = await updateProduct(product_id, req.body);
    res.status(200).json(product);
  } catch (err:any) {
    res.status(404).json({ error: err.message });
  }
};

export const handleDeleteProduct = async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    await deleteProduct(product_id);
    res.status(204).send();
  } catch (err:any) {
    res.status(404).json({ error: err.message });
  }
};
