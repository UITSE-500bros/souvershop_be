import {Response } from 'express';
import ProfileService from '../services/profile.service';
import multer from 'multer';
import { AuthenticatedRequest } from '../middleware/authorizeRole';

class ProfileController {
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const user_id = req.userId;
    const { user_name, user_address, user_phone_number } = req.body;

    try {
      // kiểm tra có upload avatar không
      let file: Express.Multer.File | undefined = undefined;
      if (req.file) {
        file = req.file;
      }

      // tạo object các field cần update
      const updatedFields = {
        user_name,
        user_address,
        user_phone_number,
        file,
      };

      const updatedUser = await ProfileService.updateProfile(
        user_id,
        updatedFields
      );

      return res.status(200).json(updatedUser);
    } catch (err: any) {
      // cho multer kiểm tra định dạng file
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message || 'Failed to update profile' });
    }
  }
  async getProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const user_id = req.userId;
    try {
      const user = await ProfileService.getProfile(user_id);
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message || 'Failed to get profile' });
    }
  }
}

const profileController = new ProfileController();
export default profileController;