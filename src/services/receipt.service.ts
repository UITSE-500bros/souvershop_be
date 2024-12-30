import { ProductList } from "../models";
import { supabase } from "../utils";
class ReceiptService {

    async storeReceipt(response: any) {
        // Extract orderId and products using regex and JSON.parse
        const orderInfoParts = response.vnp_OrderInfo.split(', ');

        const products: ProductList[] = JSON.parse(orderInfoParts[1]);
        console.log(products);
        const result = await Promise.all([
            supabase.from('receipt').insert({
                total: response.vnp_Amount,
                product_list: products,
            }).single(),
        
            // Update the product quantity in the database
            await Promise.all(products.map(async (product) => {
                try {
                    console.log(product);
                    const product_quantity = await supabase.from('product').select('product_quantity').eq('product_id', product.product_id).single();
                    
                    const { data, error } = await supabase
                        .from('product')
                        .update({ product_quantity:   product_quantity.data.product_quantity - product.quantity })
                        .eq('product_id', product.product_id)
                        .single();
                        
                    if (error) {
                        throw new Error(error.message);
                    }
                    return data;
                } catch (err) {
                    // Handle the error, e.g., log it or return null to avoid breaking Promise.all
                    console.error('Error updating product:', err);
                    return null;  // or return { success: false } to indicate failure
                }
            })),
        ]);
        
        return result;
        
    }

}
const receiptService = new ReceiptService();
export default receiptService;