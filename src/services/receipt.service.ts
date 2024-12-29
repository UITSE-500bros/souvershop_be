import { supabase } from "../utils";
class ReceiptService {

    async storeReceipt(response: any) {
        const {error} = await supabase.from('receipts').insert({
            total: response.vnp_Amount,
            cusomer_id: response.vnp_CustomerId,
        }).single();
        if (error) {
            return error;
        }
        return 'Payment success';
    }
  
}
const receiptService = new ReceiptService();
export default receiptService;