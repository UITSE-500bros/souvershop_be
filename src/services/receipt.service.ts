import { ProductList } from "../models";
import { supabase } from "../utils";
class ReceiptService {

    async storeReceipt(response: any) {
        // Extract orderId and products using regex and JSON.parse
        const orderInfoParts = response.vnp_OrderInfo.split(', ');

        // Extract the orderId part by slicing the string
        

        // Extract the products part and parse it from JSON string
        const products: ProductList = JSON.parse(orderInfoParts[1]);
        const { data ,error } = await supabase.from('receipt').insert({
            total: response.vnp_Amount,
            
            product_list: products,
        }).single();
        if (error) {
            console.log(error);
            return error;
        }

        console.log(data);
        return 'Payment success';
    }

}
const receiptService = new ReceiptService();
export default receiptService;