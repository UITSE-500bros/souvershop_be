import { pool, supabase } from "../utils";

class ReceiptService {
    async generateOrderId(customerId, amount, products) {
        const { data, error } = await supabase
            .from("order")
            .insert({ customer_id: customerId, total: amount, product_list: products })
            .select()
            .single();

        if (error) throw error;

        await Promise.all(
            products.map(async ({ product_id, quantity }) => {
                try {
                    const { data: productData, error: selectError } = await supabase
                        .from("product")
                        .select("product_quantity")
                        .eq("product_id", product_id)
                        .single();

                    if (selectError) throw selectError;

                    const { error: updateError } = await supabase
                        .from("product")
                        .update({ product_quantity: productData.product_quantity - quantity })
                        .eq("product_id", product_id);

                    if (updateError) throw updateError;
                } catch (err) {
                    console.error("Error updating product:", err);
                }
            })
        );

        return data.receipt_id;
    }

    async updateOrder(orderId, responseCode) {
        const status = responseCode === "00" ? "Transaction successful" : "Transaction error";

        if (responseCode !== "00") {
            const { data: orderData, error: orderError } = await supabase
                .from("order")
                .select("product_list")
                .eq("receipt_id", orderId)
                .single();

            if (orderError) throw orderError;

            await Promise.all(
                orderData.product_list.map(async ({ product_id, quantity }) => {
                    try {
                        const { data: productData, error: selectError } = await supabase
                            .from("product")
                            .select("product_quantity")
                            .eq("product_id", product_id)
                            .single();

                        if (selectError) throw selectError;

                        const { error: updateError } = await supabase
                            .from("product")
                            .update({ product_quantity: productData.product_quantity - quantity })
                            .eq("product_id", product_id);

                        if (updateError) throw updateError;
                    } catch (err) {
                        console.error("Error updating product:", err);
                    }
                })
            );
        }

        const { data, error } = await supabase
            .from("order")
            .update({ transaction_status: status })
            .eq("receipt_id", orderId);

        if (error) throw error;
        return data;
    }
    async updateOrderStatus(orderId, status) {
        const orderQuery = await supabase.from("receipt").select().eq("receipt_id", orderId);
        if (orderQuery.error) throw orderQuery.error;

        await pool.query(
            'UPDATE receipt SET order_status = $1 WHERE receipt_id = $2',
            [status, orderId]
        );

        return {
            message: 'Order has been successfully cancelled',
            orderId,
            status: status,
        };
    }
}

export default new ReceiptService();