import { supabase } from '../utils';
import User from '../models/user.model';

interface UpdateFields {
  user_name?: string;
  user_address?: string;
  user_phone_number?: string;
  file?: Express.Multer.File;
}

class ProfileService {
  async updateProfile(userId: string, updatedFields: UpdateFields): Promise<User> {
    const updateData: Partial<User> = {};

    // cập nhật các field được truyền vào
    if (updatedFields.user_name) {
      updateData.user_name = updatedFields.user_name;
    }
    if (updatedFields.user_address) {
      updateData.user_address = updatedFields.user_address;
    }
    if (updatedFields.user_phone_number) {
      updateData.user_phone_number = updatedFields.user_phone_number;
    }

    // upload avatar nếu có
    if (updatedFields.file) {
      const filePath = `${userId}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, updatedFields.file.buffer, {
          contentType: updatedFields.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      updateData.user_avatar = data.publicUrl;
    }

    // cập nhật user trong supabase
    const { data, error } = await supabase
      .from('user')
      .update(updateData)
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
}

const profileService = new ProfileService();
export default profileService;