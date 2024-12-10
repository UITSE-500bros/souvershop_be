import { pool } from '../utils';

class ReviewService {
  async getAllReviews(sortBy?: string, order?: string) {
    let query = `
      SELECT r.*, 
      p.product_name, 
      p.product_image->0 as main_img,
      u.user_name,
      u.user_avatar
      FROM review r
      JOIN product p ON r.product_id = p.product_id
      JOIN "user" u ON r.customer_id = u.user_id
    `;
  
    if (sortBy === 'rating') {
      if (order === 'desc' || order === 'asc') {
        query += ` ORDER BY r.rating ${order.toUpperCase()}`;
      }
    } else if (sortBy === 'time') {
      if (order === 'newest' || order === 'oldest') {
        query += ` ORDER BY r.create_date ${order === 'newest' ? 'DESC' : 'ASC'}`;
      }
    }
  
    const result = await pool.query(query);
    return result.rows;
  }
  
  async getReviewsByCustomerId(customer_id: string, sortBy?: string, order?: string) {
    let query = `
      SELECT r.*, 
      p.product_name, 
      p.product_image->0 as main_img,
      u.user_name,
      u.user_avatar
      FROM review r
      JOIN product p ON r.product_id = p.product_id
      JOIN "user" u ON r.customer_id = u.user_id
      WHERE r.customer_id = $1
    `;
  
    if (sortBy === 'rating') {
      if (order === 'desc' || order === 'asc') {
        query += ` ORDER BY r.rating ${order.toUpperCase()}`;
      }
    } else if (sortBy === 'time') {
      if (order === 'newest' || order === 'oldest') {
        query += ` ORDER BY r.create_date ${order === 'newest' ? 'DESC' : 'ASC'}`;
      }
    }
  
    const result = await pool.query(query, [customer_id]);
    return result.rows;
  }
  
  async getReviewsByProductId(product_id: string, sortBy?: string, order?: string) {
    let query = `
      SELECT r.*, 
      p.product_name, 
      p.product_image->0 as main_img,
      u.user_name,
      u.user_avatar
      FROM review r
      JOIN product p ON r.product_id = p.product_id
      JOIN "user" u ON r.customer_id = u.user_id
      WHERE r.product_id = $1
    `;
  
    if (sortBy === 'rating') {
      if (order === 'desc' || order === 'asc') {
        query += ` ORDER BY r.rating ${order.toUpperCase()}`;
      }
    } else if (sortBy === 'time') {
      if (order === 'newest' || order === 'oldest') {
        query += ` ORDER BY r.create_date ${order === 'newest' ? 'DESC' : 'ASC'}`;
      }
    }
  
    const result = await pool.query(query, [product_id]);
    return result.rows;
  }

  async createReview(
    receipt_id: string,
    customer_id: string,
    product_id: string,
    review_text: string,
    rating: number
  ) {
    const result = await pool.query(
      `INSERT INTO review (
        receipt_id, 
        customer_id, 
        product_id, 
        review_text, 
        rating, 
        create_date, 
        update_date
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *`,
      [receipt_id, customer_id, product_id, review_text, rating]
    );
    return result.rows[0];
  }

  async updateReview(
    customer_id: string,
    product_id: string,
    receipt_id: string,
    review_text: string,
    rating: number
  ) {
    const result = await pool.query(
      `UPDATE review 
       SET 
       review_text = $4, 
       rating = $5, 
       update_date = NOW()
       WHERE customer_id = $1 AND product_id = $2 AND receipt_id = $3
       RETURNING *`,
      [customer_id, product_id, receipt_id, review_text, rating]
    );
    if (result.rows.length === 0) {
      throw new Error('Review not found');
    }
    return result.rows[0];
  }

  async getTopReviews() {
    const result = await pool.query(
      `
      SELECT 
      r.*, 
      p.product_name, 
      p.product_image->0 as main_img, 
      u.user_name, 
      u.user_avatar
      FROM review r
      JOIN product p ON r.product_id = p.product_id
      JOIN "user" u ON r.customer_id = u.user_id
      ORDER BY r.rating DESC
      LIMIT 8
      `
    );
    return result.rows;
  }

  async deleteReview(customer_id: string, product_id: string, receipt_id: string) {
    const result = await pool.query(
      'DELETE FROM review WHERE customer_id = $1 AND product_id = $2 AND receipt_id = $3 RETURNING *',
      [customer_id, product_id, receipt_id]
    );
    if (result.rows.length === 0) {
      throw new Error('Review not found');
    }
    return result.rows[0];
  }

  async getAverageRatingByProductId(product_id: string) {
    const result = await pool.query(
      `SELECT AVG(rating) as average_rating 
       FROM review 
       WHERE product_id = $1`,
      [product_id]
    );

    const averageRating = result.rows[0].average_rating;
    return averageRating ? parseFloat(averageRating).toFixed(1) : null;
  }
}

const reviewService = new ReviewService();
export default reviewService;