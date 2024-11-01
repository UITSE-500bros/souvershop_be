import ProductList from "./product_list.model";

export default class GRN {
    grn_id: string;
    total: number;
    create_at: Date;
    creater_id: string;
    product_list: ProductList[];

    constructor(grn_id: string, total: number, create_at: Date, creater_id: string, product_list: ProductList[]) {
        this.grn_id = grn_id;
        this.total = total;
        this.create_at = create_at;
        this.creater_id = creater_id;
        this.product_list = product_list;
    }
}