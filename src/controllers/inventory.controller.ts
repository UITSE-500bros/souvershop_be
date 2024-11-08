import { Request, Response } from 'express';
import InventoryService from '~/services/inventory.service';

export class InventoryController {
	async getAllInventories(Response: Response): Promise<Response> {
		try {
			const inventories = await InventoryService.getAllInventories();
			return Response.status(200).json(inventories);
		} catch (err) {
			return Response.status(500).json({ error: 'Failed to retrieve inventories' });
		}
	}

	async getInventoryByProductId(Request: Request, Response: Response): Promise<Response> {
		const { product_id } = Request.params;
		try {
			const inventory = await InventoryService.getInventoryByProductId(product_id);
			return Response.status(200).json(inventory);
		} catch (err: any) {
			return Response.status(404).json({ error: err.message });
		}
	}
}

const inventoryController = new InventoryController();
export default inventoryController;