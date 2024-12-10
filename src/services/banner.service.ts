import { supabase } from '../utils';

class BannerService {
  private bucketName = 'banners';

  async getBanners() {
    const bannerNames = [
      'banner_main', 
      'banner_1', 
      'banner_2', 
      'banner_3', 
      'banner_4', 
      'banner_5', 
      'banner_6', 
      'banner_7', 
      'banner_8', 
      'banner_9', 
      'banner_10'
    ];
    const banners: { [key: string]: string | null } = {};

    const { data: allFiles, error: listError } = await supabase.storage.from(this.bucketName).list();
    if (listError) {
      console.error(`Error fetching files:`, listError);
      return banners;
    }

    for (const bannerName of bannerNames) {
      let matchingFile;
      for (const file of allFiles) {
        const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
        if (fileNameWithoutExtension === bannerName) {
          matchingFile = file;
          break;
        }
      }

      if (matchingFile) {
        try {
          const { data: urlData } = await supabase.storage.from(this.bucketName).getPublicUrl(matchingFile.name);
          banners[bannerName] = urlData.publicUrl;
        } catch (urlError) {
          console.error(`Error getting public URL for ${bannerName}:`, urlError);
          banners[bannerName] = null;
        }
      } else {
        banners[bannerName] = null;
      }
    }
    return banners;
  }

  async updateBanner(bannerName: string, file: Express.Multer.File) {

    const { data: listData, error: listError } = await supabase.storage.from(this.bucketName).list('', {
      limit: 100,
      offset: 0,
      search: bannerName,
    });

    if (listError) {
      throw new Error(`Failed to list files in bucket: ${listError.message}`);
    }

    if (listData && listData.length > 0) {
      const { error: deleteError } = await supabase.storage.from(this.bucketName).remove([listData[0].name]);
      if (deleteError) {
        throw new Error(`Failed to delete old banner: ${deleteError.message}`);
      }
    }

    const fileExt = file.originalname.split('.').pop();
    const filePath = `${bannerName}.${fileExt}`;
    const { data, error } = await supabase.storage.from(this.bucketName).upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

    if (error) {
      throw new Error(`Failed to upload banner: ${error.message}`);
    }

    try {
      const { data: urlData } = await supabase.storage.from(this.bucketName).getPublicUrl(filePath);
      return {
        path: data?.path,
        publicURL: urlData.publicUrl,
      };
    } catch (urlError) {
        throw new Error(`Failed to get public URL: ${urlError}`);
    }
  }
}

const bannerService = new BannerService();
export default bannerService;