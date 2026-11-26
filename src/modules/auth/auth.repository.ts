import { pool } from "../../db"
import type { signupSchemaType } from "./auth.schema";
import type { User } from "./auth.type";

const dbUser = async (email: string):Promise<User | null> => { 
    const user = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
    );
    return user.rows[0] ?? null;
}

const insertUser = async (payload: signupSchemaType): Promise<User> => { 
    const { name, email, password, role} = payload
    const user = await pool.query(
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [name, email, password, role]
    );
    return user.rows[0];
}

export const authRepository = {
    dbUser,insertUser
}