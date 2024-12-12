import { Request, Response } from 'express';
import BannerService from '../services/banner.service';

class BannerController {
  async getBanners(req: Request, res: Response) {
    try {
      const banners = await BannerService.getBanners();
      return res.status(200).json(banners);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to get banners' });
    }
  }

  async updateBanner(req: Request, res: Response) {
    const { bannerName } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const updatedBanner = await BannerService.updateBanner(bannerName, file);
      return res.status(200).json(updatedBanner);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

const bannerController = new BannerController();
export default bannerController;