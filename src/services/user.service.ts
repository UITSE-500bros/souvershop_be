import { User } from "~/models";
import { pool, supabase } from "~/utils/pool";

class UserService {
    async createUser(user: User) {
        const { error } = await supabase
            .from('user')
            .insert({
                user_name: user.name,
                user_email: user.email,
                user_password: user.password,
                role_id: user.role,
                created_at: user.created_at,
                update_at: user.updated_at,
                address: user.address,
                product_list: user.product_list,
                favourite_list: user.favourite_list,
                salary: user.salary,
                phone: user.phone,
                resetPasToken: user.resetPasToken,
                accessToken: user.accessToken,
                verifyToken: user.verifyToken
            })
        if (error) {
            return error.message;
        }
        return 'User created';


    }

    async getUserByEmail(email: string) {
        
        let { data: user, error } = await supabase
            .from('user')
            .select('*')
            .eq('user_email', email)
            .single()
        if (error) {
            return error.message;
        }
        return user;

    }
}

export default new UserService();