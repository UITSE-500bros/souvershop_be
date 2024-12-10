import { Router } from 'express';
import { profileController } from '../controllers';
import { upload } from '../middleware/upload';

const router = Router();

router.put('/name/:user_id', profileController.updateName);

router.put('/avatar/:user_id', upload.single('avatar'), profileController.updateAvatar);

// cập nhật avatar sẽ lưu file vào bucket avatars với tên là <user_id>.jpg
export default router;