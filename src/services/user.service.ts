import { User } from "~/models";
import { pool, supabase } from "~/utils/pool";

class UserService {
    async createUser(user: User) {
        const { data, error }: { data: { id: string } | null, error: any } = await supabase
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
            .single();
        if (error) {
            return error.message;
        }
        return { ...user, id: data?.id };


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

    async updateUserTokens(user: User, tokens: { accessToken?: string; resetPasToken?: string; verifyToken?: string }) {
        try {
            const { error } = await supabase
                .from('user')
                .update({
                    accessToken: tokens.accessToken,
                    resetPasToken: tokens.resetPasToken,  
                    verifyToken: tokens.verifyToken   
                })
                .eq('user_id', user.id);
    
            if (error) {
                console.error("Error updating tokens:", error);
                return null; // or handle the error as needed
            }
    
            return "Tokens updated successfully";
        } catch (err) {
            console.error("Unexpected error:", err);
            return null; // handle unexpected errors
        }
    }
    
}

export default new UserService();