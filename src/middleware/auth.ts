import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Role } from "../utils/type";
import sendResponse from "../utils/sendResponse";
import config from "../config";
import { authRepository } from "../modules/auth/auth.repository";

export const auth = (errMessage?:string, ...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "missing token",
                });
                return;
            }

            const parts = authHeader.trim().split(/\s+/);
            const token = parts.length === 1 ? parts[0] :
                (parts.length === 2 && parts[0]?.toLowerCase() === "bearer") ? parts[1] : null;
        
            if (!token) {
                sendResponse(res, {
                    statusCode: 401,
                    success: false,
                    message: "invalid token",
                });
                return;
            }

            const decode = jwt.verify(
                token as string,
                config.jwt_secret,
            ) as {id:number, role:string};

            const user = await authRepository.searchUserById(decode.id);

            if (!user) {
                sendResponse(res, {
                    statusCode: 404,
                    success: false,
                    message: "user not found",
                });
                return;
            }

            if (roles.length && !roles.includes(user.role)) {
                sendResponse(res, {
                    statusCode: 403,
                    success: false,
                    message: errMessage || "role didn't match",
                });
                return;
            }

            req.user = decode;
            next();
        } catch (error) {
            next(error);
        }
    }
}