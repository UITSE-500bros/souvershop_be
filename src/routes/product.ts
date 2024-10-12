import { Request, Response, Router } from 'express';
import {pool} from 'src/index'

const router = Router();

router.post('/product', async (req: Request, res: Response) => {
  const {
    product_id,
    category_id,
    product_image,
    product_describe,
    product_selling_price,
    product_import_price,
    product_status,
    is_sale,
    percentage_sale,
  } = req.body;

  if (!product_id || !category_id || !product_image || !product_describe) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Product (
        product_id, category_id, product_image, product_describe,
        product_selling_price, product_import_price, product_status,
        is_sale, percentage_sale, create_at, update_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *`,
      [
        product_id, category_id, product_image, product_describe,
        product_selling_price, product_import_price, product_status,
        is_sale, percentage_sale
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/product/:product_id', async (req: Request, res: Response) => {
  const { product_id } = req.params;
  const {
    category_id,
    product_image,
    product_describe,
    product_selling_price,
    product_import_price,
    product_status,
    is_sale,
    percentage_sale
  } = req.body;

  if (!category_id || !product_image || !product_describe) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `UPDATE Product SET
        category_id = $1,
        product_image = $2,
        product_describe = $3,
        product_selling_price = $4,
        product_import_price = $5,
        product_status = $6,
        is_sale = $7,
        percentage_sale = $8,
        update_at = NOW()
      WHERE product_id = $9
      RETURNING *`,
      [
        category_id, product_image, product_describe, product_selling_price,
        product_import_price, product_status, is_sale, percentage_sale, product_id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/product/:product_id', async (req: Request, res: Response) => {
  const { product_id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM Product WHERE product_id = $1 RETURNING *',
      [product_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
