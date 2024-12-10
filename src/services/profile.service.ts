import { supabase } from '../utils';
import User from '../models/user.model';

class ProfileService {
  async updateName(userId: string, userName: string) {
    const { data, error } = await supabase
      .from('user')
      .update({ user_name: userName })
      .eq('user_id', userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
    if (!data || data.length === 0) {
      throw new Error('User not found');
    }
    const updatedUser = data[0] as unknown as User;
    return updatedUser;
  }

  async updateAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    // 1. Tải file lên Supabase Storage
    const filePath = `${userId}`;
    const {  error: uploadError } = await supabase.storage 
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Lấy URL công khai của file đã tải lên
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const user_avatar = data.publicUrl;

    // 3. Cập nhật user_avatar trong bảng user
    const { data: updateData, error } = await supabase
      .from('user')
      .update({ user_avatar: user_avatar })
      .eq('user_id', userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }
    if (!updateData || updateData.length === 0) {
      throw new Error('User not found');
    }

    const updatedUser = updateData[0] as unknown as User;
    return updatedUser;
  }
}

const profileService = new ProfileService();
export default profileService;