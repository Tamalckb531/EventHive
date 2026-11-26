import bcrypt from "bcryptjs";
import jwt, {type SignOptions } from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import { authRepository} from "./auth.repository"
import config from "../../config";
import type { loginSchemaType, signupSchemaType } from "./auth.schema";

const LoginServiceFunction = async (payload: loginSchemaType) => { 
    const { email, password } = payload;
    const user = await authRepository.dbUser(email);

    if (!user) {
        throw new AppError("invalid email or password",401);
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        throw new AppError("invalid email or password", 401);
    }

    const jwtPayload = {
        id: user.id,
        role: user.role, 
    }

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
        expiresIn: config.jwt_expires_in as NonNullable<SignOptions["expiresIn"]>
    });

    return {
        token: accessToken,
        data: {
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
        }
    }
}
const SignupServiceFunction = async (payload: signupSchemaType) => { 
    const userExist = await authRepository.dbUser(payload.email);

    if (userExist) {
        throw new AppError("email already registered",409);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    const user = await authRepository.insertUser({...payload, password:hashedPassword})

    return {
        data: {
            id:user.id,
            name:user.name,
            email:user.email,
            role: user.role,
            created_at:user.created_at,
            updated_at:user.updated_at,
        }
    }
}

export const authService = {
    LoginServiceFunction,
    SignupServiceFunction
}