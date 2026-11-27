import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { AppError } from "../../utils/AppError";
import { createBookingSchema } from "./booking.schema";
import { bookingsService } from "./booking.service";

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
        const result = await bookingsService.CreateBookingServiceFunction(payload.data, user.id);
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

const BookingsGetControllerFunction = async (
  req: Request,
  res: Response
) => {
    try {
        const user = req.user as ReqUser;

        const result = await bookingsService.GetUserBookingsServiceFunction(user.id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Bookings retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        const isAppError = error instanceof AppError;

        sendResponse(res, {
            statusCode: isAppError ? error.statusCode : 500,
            success: false,
            message: isAppError ? error.message : "Internal Server Error",
        });
    }
};

const BookingCancelControllerFunction = async (
  req: Request,
  res: Response
) => {
    try {
        const id = Number(req.params.id);
        const user = req.user as ReqUser;

        if (!Number.isInteger(id) || id <= 0) {
            throw new AppError("invalid iD", 400);
        }

        const result = await bookingsService.CancelBookingServiceFunction(id,user.id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking cancelled successfully",
            data: result,
        });
    }
    catch (error: any) {
        const isAppError = error instanceof AppError;

        sendResponse(res, {
            statusCode: isAppError ? error.statusCode : 500,
            success: false,
            message: isAppError ? error.message : "Internal Server Error",
        });
    }
};

export const bookingsController = {
    BookingCreateControllerFunction,
    BookingsGetControllerFunction,
    BookingCancelControllerFunction
}