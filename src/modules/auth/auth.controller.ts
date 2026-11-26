import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { loginSchema, signupSchema } from "../../utils/shcema";
import { authService } from "./auth.service";

const LoginControllerFunction = async (req: Request, res: Response) => {
    try {
        const payload = loginSchema.safeParse(req.body);
        if (!payload.success) {
            const issue = payload.error.issues[0];
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "validation failure",
                errors: [{ field: String(issue?.path[0] ?? ""), message: issue?.message }],
            });
            return;
        }
        const result = await authService.LoginServiceFunction(payload.data);
        const data = {
            "token": result.token,
            "user": result.data
        }
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: data,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: error.statusCode || 500,
            success: false,
            message: error?.message || "Internal Server Error",
            errors: [{ field: "login", message: error?.message || "Internal Server Error" }],
        });
    }
}

const SignupControllerFunction = async (req: Request, res: Response) => {
    try {
        const payload = signupSchema.safeParse(req.body);
        if (!payload.success) {
            const issue = payload.error.issues[0];
            sendResponse(res, {
                statusCode: 400,
                success: false,
                message: "validation failure",
                errors: [{ field: String(issue?.path[0] ?? ""), message: issue?.message }],
            });
            return;
        }
        const result = await authService.SignupServiceFunction(payload.data);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result.data,
        });
    } catch (error: any) {
        sendResponse(res, {
            statusCode: error.statusCode || 500,
            success: false,
            message: error?.message || "Internal Server Error",
            errors: [{ field: "signup", message: error?.message || "Internal Server Error" }],
        });
    }
}

export const authController = {
    LoginControllerFunction,
    SignupControllerFunction
}