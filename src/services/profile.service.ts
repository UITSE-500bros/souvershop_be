import { supabase } from '../utils';
import User from '../models/user.model';

export interface UpdateFields {
  user_name?: string;
  user_address?: string;
  user_phone_number?: string;
  file?: Express.Multer.File;
}

class ProfileService {
  async updateProfile(userId: string, updatedFields: UpdateFields): Promise<User> {
    const updateData: Partial<User> = {};

    // Update fields if they are provided
    if (updatedFields.user_name) {
      updateData.user_name = updatedFields.user_name;
    }
    if (updatedFields.user_address) {
      updateData.user_address = updatedFields.user_address;
    }
    if (updatedFields.user_phone_number) {
      updateData.user_phone_number = updatedFields.user_phone_number;
    }

    // Upload avatar if file is provided
    if (updatedFields.file) {
      const filePath = `${userId}/${updatedFields.file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, updatedFields.file.buffer, {
          contentType: updatedFields.file.mimetype,
          upsert: true, // Overwrite if exists
        });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        throw new Error(uploadError.message); // Throw error if upload fails
      }

      const { data: fileData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      updateData.user_avatar = fileData?.publicUrl; // Set avatar URL only if the file is uploaded successfully
    }
    // Update user data in Supabase
    const { data, error } = await supabase
      .from('user')
      .update(updateData)
      .eq('user_id', userId)
      .select('user_name, user_address, user_phone_number, user_avatar');

    if (error) {
      console.error('Database update error:', error);
      throw new Error(error.message); // Throw error if DB update fails
    }

    // Return the updated user (first item from returned data)
    return data?.[0] as User;
  }
  async getProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('user')
      .select('user_name,user_email, user_address, user_phone_number, user_avatar')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    if (!data || data.length === 0) {
      throw new Error('User not found');
    }

    const user = data[0] as unknown as User;
    return user;
  }
}

const profileService = new ProfileService();
export default profileService;