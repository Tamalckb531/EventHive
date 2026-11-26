import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import { createEventSchema } from "./event.schema";

const EventCreateControllerFunction = async (req: Request, res: Response) => {
    try {
        const payload = createEventSchema.safeParse(req.body);
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
        const result = await eventService.LoginServiceFunction(payload.data);
        const data = {
            "user": result.data
        }
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: data,
        });
    } catch (error: any) {
        const isAppError = error instanceof AppError;
        sendResponse(res, {
            statusCode: isAppError ? error.statusCode : 500,
            success: false,
            message: isAppError? error.message : "Internal Server Error",
        });
    }
}

export const eventController = {
    EventCreateControllerFunction
}