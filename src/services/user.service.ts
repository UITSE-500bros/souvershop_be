import { User } from "../models";
import { pool, supabase } from "../utils";

class UserService {
    async createUser(user: User , role : string){
        const { data, error } = await supabase
            .from('user')
            .insert({
                user_email: user.user_email,
                user_password: user.user_password,
                create_at: user.created_at,
                update_at: user.updated_at
            })
            .select();
        const newUser: User = data[0];
        if (error) {
            console.log(error);
            return null;
        }
        const res = await this.signUserRole(newUser, role);
        if (!res) {
            return null;
        }
        return newUser;
    }

    async signUserRole(user: User, role: string) {
        let role_id: number;
        switch (role) {
            case 'employee':
                role_id = 1;
                break;
            case 'customer':
                role_id = 2;
                break;
            default:
                role_id = 3;
                break;
        }
        const { data, error } = await supabase
            .from('role_user')
            .insert({
                user_id: user.user_id,
                role_id: role_id
            })
            .select();
        if (error) {
            console.log(error);
            return null;
        }
        return data;
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
    async getUserRole(user: User) {
        const { data: role, error } = await supabase
            .from('role_user')
            .select('role_id')
            .eq('user_id', user.user_id)
            .single();
        if (error) {
            console.log(error);
            return null;
        }
        console.log(role);
        return role;
    }

    async getUsersByRole(role: string) {
        const userQuery = `
            SELECT
                *
                FROM
                "user"
                WHERE
                user_id IN (
                    SELECT
                    user_id
                    FROM
                    role_user
                    WHERE
                    role_id IN (
                        SELECT
                        role_id
                        FROM
                        role
                        WHERE
                        role_name = '${role}'
                    )
            );
        `;

        const response = await pool.query(userQuery);
        
        return response.rows;
    }

    async updateUserTokens(user: User, tokens: { accessToken?: string; refreshToken?: string, resetPasToken?: string; verifyToken?: string; }) {
        try {
            const { error } = await supabase
                .from('user')
                .update({
                    access_token: tokens.accessToken,
                    refresh_token: tokens.refreshToken,
                    reset_pass_token: tokens.resetPasToken,  
                    verify_token: tokens.verifyToken   
                })
                .eq('user_id', user.user_id);
    
            if (error) {
                console.error("Error updating tokens:", error);
                return null;
            }
    
            return ;
        } catch (err) {
            console.error("Unexpected error:", err);
            return null;
        }
    }
    async updateStatus(user: User, status: string) {
        try {
            const { error } = await supabase
                .from('user')
                .update({
                    user_account_status: status,
                })
                .eq('user_id', user.user_id);
    
            if (error) {
                console.error("Error updating status:", error);
                return null; // or handle the error as needed
            }
            return ;
        } catch (err) {
            console.error("Unexpected error:", err);
            return null;
        }
    }
    
}
const userService = new UserService();

export default userService;