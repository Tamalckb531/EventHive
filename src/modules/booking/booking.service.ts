import { AppError } from "../../utils/AppError";
import { bookingsRepository } from "./booking.repository";
import type { CreateBookingSchemaType } from "./booking.schema";
import type { Booking } from "./booking.type";


const CreateBookingServiceFunction = async (
  payload: CreateBookingSchemaType,
  attendeeId: number
): Promise<Booking | undefined> => {
    const result = await bookingsRepository.createBooking(payload, attendeeId);
    return result;
};


export const bookingsService = {
    CreateBookingServiceFunction
}