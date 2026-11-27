import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import { createEventSchema, eventQuerySchema } from "./event.schema";
import { eventService } from "./event.service";

interface ReqUser{
    id: number,
    role:string
}

const EventCreateControllerFunction = async (req: Request, res: Response) => {
    try {
        const payload = createEventSchema.safeParse(req.body);
        const user = req.user as ReqUser;
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
        const result = await eventService.CreateEventServiceFunction(payload.data, user.id);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Event created successfully",
            data: result,
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
const EventGetControllerFunction = async (req: Request, res: Response) => {
    try {
        const { search } = eventQuerySchema.parse(req.query);
        const result = await eventService.GetEventServiceFunction(search);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Events retrieved successfully",
            data: result,
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
const EventGetOneControllerFunction = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const result = await eventService.GetOneEventServiceFunction(id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Event retrieved successfully",
            data: result,
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
    EventCreateControllerFunction,
    EventGetControllerFunction,
    EventGetOneControllerFunction
}