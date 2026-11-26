import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { loginSchema } from "../../utils/shcema";
import { authService } from "./auth.service";

const LoginControllerFunction = async (req: Request, res: Response) => {
    try {
        const payload = loginSchema.safeParse(req.body);
        if (!payload.success) {
            const error = payload.error.issues[0];
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: error?.message || "Payload Validation Failed",
                error: error,
            });
            return;
        }
        const result = await authService.LoginServiceFunction(payload.data);
        const data = {
            "token": result.token,
            "user": result.data
        }
        sendResponse(res, {
            statusCode: 400,
            success: true,
            message: "Login successful",
            data: data,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: error.statusCode || 500,
            success: false,
            message: error?.message,
            error: error,
        });
    }
}

export const authController = {
    LoginControllerFunction
}