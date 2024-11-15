import ProductList from "./product_list.model";
interface UserParams {
    user_id?: string | null;
    user_avatar?: string | null;
    user_name?: string | null;
    user_email?: string | null;
    user_password?: string | null;
    user_role?: number | null;
    user_phoneNumber?: string | null;

    //customer
    customer_address?: string | null;
    customer_productList?: ProductList[] | null;
    customer_favouriteList?: ProductList[] | null;

    //staff
    staff_salary?: number | null;
    
    account_status?: string | null;
    resetPasToken?: string | null;
    accessToken?: string | null;
    verifyToken?: string | null;
    created_at: Date;
    updated_at: Date;
}

class User {
    user_id: string | null = null;
    user_avatar: string | null = null;
    user_name: string | null = null;
    user_email: string | null = null;
    user_password: string | null = null;
    user_role: number | null = null;
    user_phoneNumber: string | null = null;


    customer_address: string | null = null;
    customer_productList: ProductList[] | null = null;
    customer_favouriteList: ProductList[] | null = null;

    staff_salary: number | null = null;

    account_status: string | null = null;
    resetPasToken: string | null = null;
    accessToken: string | null = null;
    verifyToken: string | null = null;
    created_at: Date;
    updated_at: Date;

    constructor(params: UserParams) {
        this.user_id = params.user_id || null;
        this.user_avatar = params.user_avatar || null;
        this.user_name = params.user_name || null;
        this.user_email = params.user_email || null;
        this.user_password = params.user_password || null;
        this.user_role = params.user_role || null;
        this.user_phoneNumber = params.user_phoneNumber || null;

        this.customer_address = params.customer_address || null;
        this.customer_productList = params.customer_productList || null;
        this.customer_favouriteList = params.customer_favouriteList || null;

        this.staff_salary = params.staff_salary || null;

        this.account_status = params.account_status || null;
        this.resetPasToken = params.resetPasToken || null;
        this.accessToken = params.accessToken || null;
        this.verifyToken = params.verifyToken || null;
        this.created_at = params.created_at;
        this.updated_at = params.updated_at;
    }

    
}

export default User;