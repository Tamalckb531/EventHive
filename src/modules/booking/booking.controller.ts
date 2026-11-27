import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import { createBookingSchema } from "./booking.schema";

interface ReqUser{
    id: number,
    role:string
}

const BookingCreateControllerFunction = async (req: Request, res: Response) => {
    try {
        const payload = createBookingSchema.safeParse(req.body);
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
        const result = await bookingService.CreateBookingServiceFunction(payload.data, user.id);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Tickets booked successfully",
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

export const bookingsController = {
    BookingCreateControllerFunction
}