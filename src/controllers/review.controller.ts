import { Request, Response } from 'express';
import ReviewService from '../services/review.service';
import { AuthenticatedRequest } from '../middleware/authorizeRole';

export class ReviewController {
  async getAllReviews(req: Request, res: Response): Promise<Response> {
    try {
      const { sortBy, order } = req.query;
      const reviews = await ReviewService.getAllReviews(sortBy as string, order as string);
      return res.status(200).json(reviews);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  async getReviewsByCustomerId(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const customer_id = req.userId
      const { sortBy, order } = req.query;
      const reviews = await ReviewService.getReviewsByCustomerId(
        customer_id,
        sortBy as string,
        order as string
      );
      return res.status(200).json(reviews);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  
  async getReviewsByProductId(req: Request, res: Response): Promise<Response> {
    try {
      const { product_id } = req.params;
      const { sortBy, order } = req.query;
      const reviews = await ReviewService.getReviewsByProductId(
        product_id,
        sortBy as string,
        order as string
      );
      return res.status(200).json(reviews);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async createReview(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const customer_id = req.userId;
    try {
      const { receipt_id, product_id, review_text, rating } = req.body;
      const review = await ReviewService.createReview(
        receipt_id, customer_id, product_id, review_text, rating
      );
      return res.status(201).json(review);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async updateReview(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const customer_id = req.userId
      const { product_id, receipt_id } = req.params;
      const { review_text, rating } = req.body;
      const review = await ReviewService.updateReview(customer_id, product_id, receipt_id, review_text, rating);
      return res.status(200).json(review);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async getTopReviews(req: Request, res: Response): Promise<Response> {
    try {
      const reviews = await ReviewService.getTopReviews();
      return res.status(200).json(reviews);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteReview(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const customer_id = req.userId
      const {  product_id, receipt_id } = req.params;
      await ReviewService.deleteReview(customer_id, product_id, receipt_id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}

const reviewController = new ReviewController();
export default reviewController;