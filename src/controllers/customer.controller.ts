import { Response } from 'express';
import customerService from '../services/customer.service';
import { AuthenticatedRequest } from 'src/middleware/authorizeRole';

class CustomerController {

    async getProfile(req, res) {
        // get customer profile
    }
    async updateProfile(req, res) {
        // update customer profile
    }
    async getOrders(req, res) {
        // get customer orders
    }
    async getOrder(req, res) {
        // get customer order
    }
    async cancelOrder(req, res) {
        // cancel customer order
    }

    async getAllCartItems(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const customerId = req.customerId; 
        try {
          const cartItems = await customerService.getAllCartItems(customerId);
          return res.status(200).json(cartItems);
        } catch (err: any) {
          return res.status(500).json({ error: err.message });
        }
      }
    
      async addToCart(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const customerId = req.customerId;
        const { product_id, quantity } = req.body;
    
        const numericQuantity = parseInt(quantity);
        if (isNaN(numericQuantity) || numericQuantity <= 0) {
          return res.status(400).json({ error: 'Invalid quantity value. Quantity must be a positive integer.' });
        }
    
        try {
          await customerService.addToCart(customerId, product_id, numericQuantity);
          return res.status(200).json({ message: 'Product added to cart successfully' });
        } catch (err: any) {
          if (err.message === 'Product not found') {
              return res.status(404).json({ error: err.message });
          }
          else if (err.message === 'Insufficient product quantity'){
              return res.status(400).json({ error: err.message });
          }
          else {
              return res.status(500).json({ error: err.message });
          }
        }
      }
    
      async editCartItem(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const customerId = req.customerId;
        const { product_id, quantity } = req.body;
        try {
          await customerService.editCartItem(customerId, product_id, quantity);
          return res.status(200).json({ message: 'Cart item updated successfully' });
        } catch (err: any) {
          return res.status(500).json({ error: err.message });
        }
      }
    
      async removeFromCart(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const customerId = req.customerId;
        const { product_id } = req.body;
        try {
          await customerService.removeFromCart(customerId, product_id);
          return res.status(200).json({ message: 'Product removed from cart successfully' });
        } catch (err: any) {
          return res.status(500).json({ error: err.message });
        }
      }

      async getAllFavourites(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const user_id = req.customerId;
        try {
          const favouriteProducts =
            await customerService.getAllFavourites(user_id);
          return res.status(200).json(favouriteProducts);
        } catch (err: any) {
          return res.status(500).json({ error: err.message });
        }
      }
    
      async addToFavourites(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const user_id = req.customerId;
        const { product_id } = req.body;
        try {
          await customerService.addToFavourites(user_id, product_id);
          return res.status(200).json({ message: 'Product added to favourites' });
        } catch (err: any) {
          return res.status(500).json({ error: err.message });
        }
      }
    
      async removeFromFavourites(req: AuthenticatedRequest, res: Response): Promise<Response> {
        const user_id = req.customerId;
        const { product_id } = req.body;
        try {
          await customerService.removeFromFavourites(user_id, product_id);
          return res.status(200).json({ message: 'Product removed from favourites' });
        } catch (err: any) {
          return res.status(500).json({ error: err.message });
        }
      }
}

const customerController = new CustomerController();
export default customerController;