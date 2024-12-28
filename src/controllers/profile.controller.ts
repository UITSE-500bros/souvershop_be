import { Request, Response } from 'express';
import ProfileService from '../services/profile.service';
import multer from 'multer';

class ProfileController {
  async updateProfile(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;
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
}

const profileController = new ProfileController();
export default profileController;