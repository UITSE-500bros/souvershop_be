import ProductList from "./product_list.model";
interface UserParams {
    user_id?: string | "";
    user_avatar?: string | "";
    user_name?: string | "";
    user_email?: string | "";
    user_password?: string | "";
    user_role?: number | 0;
    user_phoneNumber?: string | "";

    //customer
    customer_address?: string | "";
    customer_productList?: ProductList[] | "";
    customer_favouriteList?: string[] | "";

    //staff
    staff_salary?: number | 0;

    //GoogleId
    googleId?: string | "";
    
    user_account_status?: string | "";
    resetPasToken?: string | "";
    accessToken?: string | "";
    verifyToken?: string | "";
    created_at: Date;
    updated_at: Date;
}

class User {
    user_id: string | "";
    user_avatar: string | "" = "";
    user_name: string | "";
    user_email: string | "";
    user_password: string | "";
    user_role: number | 0;
    user_phoneNumber: string | "";


    customer_address: string | "";
    customer_productList: ProductList[] | "";
    customer_favouriteList: string[] | "" ;

    staff_salary: number | "";

    user_account_status: string | "" ;
    resetPasToken: string | "";
    accessToken: string | "" ;
    verifyToken: string | "";
    created_at: Date;
    updated_at: Date;

    constructor(params: UserParams) {
        this.user_id = params.user_id || "";
        this.user_avatar = params.user_avatar || "";
        this.user_name = params.user_name || "";
        this.user_email = params.user_email || "";
        this.user_password = params.user_password || "";
        this.user_role = params.user_role || 0;
        this.user_phoneNumber = params.user_phoneNumber || "";

        this.customer_address = params.customer_address || "";
        this.customer_productList = params.customer_productList || "";
        this.customer_favouriteList = params.customer_favouriteList || "";

        this.staff_salary = params.staff_salary || "";

        this.user_account_status = params.user_account_status || "";
        this.resetPasToken = params.resetPasToken || "";
        this.accessToken = params.accessToken || "";
        this.verifyToken = params.verifyToken || "";
        this.created_at = params.created_at;
        this.updated_at = params.updated_at;
    }

    
}

export default User;