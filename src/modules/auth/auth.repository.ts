import { pool } from "../../db"
import type { User } from "../../utils/type";

interface LoginPayload {
    email: string,
    password: string,
}
const dbUser = async (email: string):Promise<User | null> => { 
    const user = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    );
    return user.rows[0] ?? null;
}

export const authRepository = {
    dbUser
}