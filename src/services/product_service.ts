import { pool } from 'src/index';

export const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM product');
  return result.rows;
};

export const getProductById = async (product_id: string) => {
  const result = await pool.query('SELECT * FROM product WHERE product_id = $1', [product_id]);
  if (result.rows.length === 0) {
    throw new Error('Product not found');
  }
  return result.rows[0];
};

export const createProduct = async (productData: any) => {
  const {
    product_id, category_id, product_image, product_describe,
    product_selling_price, product_import_price, product_status,
    is_sale, percentage_sale, create_at, update_at
  } = productData;

  const result = await pool.query(
    `INSERT INTO product (
      product_id, category_id, product_image, product_describe,
      product_selling_price, product_import_price, product_status,
      is_sale, percentage_sale, create_at, update_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
    RETURNING *`,
    [
      product_id, category_id, product_image, product_describe,
      product_selling_price, product_import_price, product_status,
      is_sale, percentage_sale
    ]
  );
  return result.rows[0];
};

export const updateProduct = async (product_id: string, productData: any) => {
  const {
    category_id, product_image, product_describe, product_selling_price,
    product_import_price, product_status, is_sale, percentage_sale, update_at
  } = productData;

  const result = await pool.query(
    `UPDATE product SET
      category_id = $1, product_image = $2, product_describe = $3,
      product_selling_price = $4, product_import_price = $5,
      product_status = $6, is_sale = $7, percentage_sale = $8,
      update_at = NOW()
    WHERE product_id = $9
    RETURNING *`,
    [
      category_id, product_image, product_describe, product_selling_price,
      product_import_price, product_status, is_sale, percentage_sale, product_id
    ]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Product not found');
  }

  return result.rows[0];
};

export const deleteProduct = async (product_id: string) => {
  const result = await pool.query('DELETE FROM product WHERE product_id = $1 RETURNING *', [product_id]);

  if (result.rows.length === 0) {
    throw new Error('Product not found');
  }

  return result.rows[0];
};
