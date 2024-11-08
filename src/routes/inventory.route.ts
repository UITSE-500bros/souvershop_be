import { Router } from 'express';
import inventoryController from '~/controllers/inventory.controller';

const router = Router();

router.get('/inventories', inventoryController.getAllInventories);
router.get('/inventories/:product_id', inventoryController.getInventoryByProductId);

export default router;