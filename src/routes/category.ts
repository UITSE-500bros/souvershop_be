import { Request, Response, Router } from 'express';
import {pool} from 'src/index'

const router = Router();

router.post('/category', async (req: Request, res: Response) => {
  const { category_id, category_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Category (category_id, category_name) VALUES ($1, $2) RETURNING *',
      [category_id, category_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.get('/category', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM Category');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

router.get('/category/:category_id', async (req: Request, res: Response) => {
  const { category_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM Category WHERE category_id = $1',
      [category_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
});

router.put('/category/:category_id', async (req: Request, res: Response) => {
  const { category_id } = req.params;
  const { category_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Category SET category_name = $1 WHERE category_id = $2 RETURNING *',
      [category_name, category_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});


router.delete('/category/:category_id', async (req: Request, res: Response) => {
  const { category_id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM Category WHERE category_id = $1 RETURNING *',
      [category_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
