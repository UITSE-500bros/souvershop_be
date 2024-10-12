import { pool } from "src/index";

export const getAllCategories = async () => {
  const result = await pool.query('SELECT * FROM category');
  return result.rows;
};

export const getCategoryById = async (category_id: number) => {
  const result = await pool.query('SELECT * FROM category WHERE category_id = $1', [category_id]);
  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }
  return result.rows[0];
};

export const createCategory = async (category_name: string) => {
  const result = await pool.query(
    'INSERT INTO category (category_name) VALUES ($1) RETURNING *',
    [category_name]
  );
  return result.rows[0];
};

export const updateCategory = async (category_id: number, category_name: string) => {
  const result = await pool.query(
    'UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *',
    [category_name, category_id]
  );
  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }
  return result.rows[0];
};

export const deleteCategory = async (category_id: number) => {
  const result = await pool.query('DELETE FROM category WHERE category_id = $1 RETURNING *', [category_id]);
  if (result.rows.length === 0) {
    throw new Error('Category not found');
  }
  return result.rows[0];
};
