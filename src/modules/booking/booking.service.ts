import { bookingsRepository } from "./booking.repository";
import type { CreateBookingSchemaType } from "./booking.schema";
import type { Booking, UserBooking } from "./booking.type";


const CreateBookingServiceFunction = async (
  payload: CreateBookingSchemaType,
  attendeeId: number
): Promise<Booking | undefined> => {
    const result = await bookingsRepository.createBooking(payload, attendeeId);
    return result;
};

const GetUserBookingsServiceFunction = async (
  userId: number
): Promise<UserBooking[]> => {
    const result = await bookingsRepository.getUserBookings(userId);
    return result;
};

export const bookingsService = {
    CreateBookingServiceFunction,
    GetUserBookingsServiceFunction
}