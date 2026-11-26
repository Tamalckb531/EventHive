import bcrypt from "bcryptjs";
import jwt, {type SignOptions } from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import { authRepository} from "./auth.repository"
import config from "../../config";
interface LoginPayload {
    email: string,
    password: string,
}
const LoginServiceFunction = async (payload: LoginPayload) => { 
    const { email, password } = payload;
    const user = await authRepository.dbUser(email);

    if (!user) {
        throw new AppError("Invalid Credentials",401);
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        throw new AppError("Invalid Credentials", 401);
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

export const authService = {
    LoginServiceFunction
}