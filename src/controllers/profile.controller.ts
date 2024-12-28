import { Request, Response } from 'express';
import ProfileService from '../services/profile.service';
import multer from 'multer';

class ProfileController {
  async updateName(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;
    const { user_name } = req.body;
    try {
      const updatedUser = await ProfileService.updateName(user_id, user_name);
      return res.status(200).json(updatedUser);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  async updateAvatar(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const file = req.file;

      const updatedUser = await ProfileService.updateAvatar(user_id, file);

      return res.status(200).json(updatedUser);
    } catch (err: any) {
      // Bắt lỗi từ multer và trả về thông báo lỗi cụ thể
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }
      return res.status(500).json({ error: 'Failed to upload avatar' });
    }
  }
}

const profileController = new ProfileController();
export default profileController;