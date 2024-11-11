import ProductList from "./product_list.model";

class User {
    id: string | null = null;
    name: string;
    email: string;
    password: string | null = null;
    role: number;
    created_at: string;
    updated_at: string;
    address: string | null = null;
    product_list: ProductList[] | null = null;
    favourite_list: ProductList[] | null = null;
    salary: number | null = null;
    phone: string | null = null;
    resetPasToken: string | null = null;
    accessToken: string | null = null;
    verifyToken: string | null = null;

    constructor({
        id = null,
        name,
        email,
        password = null,
        role,
        created_at,
        updated_at,
        address = null,
        product_list = null,
        favourite_list = null,
        salary = null,
        phone = null,
        resetPasToken = null,
        accessToken = null,
        verifyToken = null
    }: {
        id?: string | null;
        name: string;
        email: string;
        password?: string | null;
        role: number;
        created_at: string;
        updated_at: string;
        address?: string | null;
        product_list?: ProductList[] | null;
        favourite_list?: ProductList[] | null;
        salary?: number | null;
        phone?: string | null;
        resetPasToken?: string | null;
        accessToken?: string | null;
        verifyToken?: string | null;
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.address = address;
        this.product_list = product_list;
        this.favourite_list = favourite_list;
        this.salary = salary;
        this.phone = phone;
        this.resetPasToken = resetPasToken;
        this.accessToken = accessToken;
        this.verifyToken = verifyToken;
    }
}
export default User;