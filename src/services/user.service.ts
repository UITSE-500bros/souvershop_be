import { User } from "../models";
import { supabase } from "../utils";

class UserService {
    // async updateUser(userId: any, arg1: { verify: any; verifiedEmailToken: string; }) {
    //     const { error} = await supabase.from('user')
    //                         .update({
    //                             account_status: arg1.verify,
    //                             verifyToken: arg1.verifiedEmailToken
    //                         })
    //                         .eq('user_id', userId);
    //     if (error) {
    //         return error.message;
    //     }
    // }
    async createUser(user: User):Promise<User | null> {
        const { error } = await supabase
            .from('user')
            .insert({
                user_name: user.user_name,
                user_email: user.user_email,
                user_password: user.user_password,
                user_phone_number: user.user_phoneNumber,
                create_at: user.created_at,
                update_at: user.updated_at
            })
            .single();
        if (error) {
            console.log(error);
            return null;
        }
        return user;
    }

    async getUserByEmail(email: string):Promise<User | null> {
        let { data: user, error } = await supabase
            .from('user')
            .select('*')
            .eq('user_email', email)
            .single()
        if (error) {
            return null;
        }
        return user;

    }
    async getUserByID(user_id: string) {
        
        let { data: user, error } = await supabase
            .from('user')
            .select('*')
            .eq('user_id', user_id)
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
                .eq('user_id', user.user_id);
    
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
const userService = new UserService();

export default userService;