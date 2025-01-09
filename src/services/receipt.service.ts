import { pool, supabase } from "../utils";

class ReceiptService {
    async generateOrderId(
        customerId: string,
        amount: number,
        products: { product_id: string; quantity: number; product_total: number }[] = []
    ) {
        try {
            const { data, error } = await supabase
                .from("receipt")
                .insert({ customer_id: customerId, total: amount, product_list: products, payment_method: 'vnpay' })
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

                        if (selectError) {
                            console.error(`Product not found with ID: ${product_id}`);
                            return; // Skip this product if not found
                        }

                        const newQuantity = productData.product_quantity - quantity;

                        const { error: updateError } = await supabase
                            .from("product")
                            .update({ product_quantity: newQuantity })
                            .eq("product_id", product_id);

                        if (updateError) throw updateError;
                    } catch (err) {
                        console.error(`Error updating product with ID ${product_id}:`, err);
                        throw err;
                    }
                })
            );

            return data.receipt_id;
        } catch (error) {
            console.error("Error generating order:", error);
            throw error;
        }
    }

    async updateOrder(orderId: string, responseCode: string) {
        const status = responseCode === "00" ? "Transaction successful" : "Transaction error";

        if (responseCode !== "00") {
            const { data: orderData, error: orderError } = await supabase
                .from("receipt")
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
                            .update({ product_quantity: productData.product_quantity + quantity })
                            .eq("product_id", product_id);

                        if (updateError) throw updateError;
                    } catch (err) {
                        console.error("Error updating product:", err);
                    }
                })
            );
            await supabase.from("receipt").delete().eq("receipt_id", orderId);
        }
        // else {
        //     const { data: orderData, error: orderError } = await supabase
        //         .from("receipt")
        //         .select("product_list")
        //         .eq("receipt_id", orderId)
        //         .single();

        //     if (orderError) throw orderError;

        //     await Promise.all(
        //         orderData.product_list.map(async ({ product_id, quantity }) => {
        //             try {
        //                 const { data: productData, error: selectError } = await supabase
        //                     .from("user")
        //                     .select("product")
        //                     .eq("product_id", product_id)
        //                     .single();

        //                 if (selectError) throw selectError;

        //                 const { error: updateError } = await supabase
        //                     .from("product")
        //                     .update({ product_sold: productData.product_sold + quantity })
        //                     .eq("product_id", product_id);

        //                 if (updateError) throw updateError;
        //             } catch (err) {
        //                 console.error("Error updating product:", err);
        //             }
        //         })
        //     );
        // }

        const { data, error } = await supabase
            .from("receipt")
            .update({ transaction_status: status })
            .eq("receipt_id", orderId)
            .select() // Ensure this is chained correctly
            .single();

        if (error) throw error;

        if (data) {
            const response = await pool.query(`
        UPDATE user
        SET
            user_level = CASE
                WHEN user_level < 20 THEN user_level + 5
                ELSE user_level
            END
        WHERE user_id = ${data.customer_id}
        RETURNING *;
    `);
        }


        return data;
    }
    async updateOrderStatus(orderId: string, status: string) {
        const orderQuery = await supabase.from("receipt").select().eq("receipt_id", orderId);
        if (orderQuery.error) throw orderQuery.error;

        await pool.query(
            'UPDATE receipt SET status = $1 WHERE receipt_id = $2',
            [status, orderId]
        );

        return {
            message: 'Order has been successfully cancelled',
            orderId,
            status: status,
        };
    }
    async getOrders() {
        const { data, error } = await supabase.from("receipt").select();
        if (error) throw error;
        return data;
    }
}

export default new ReceiptService();