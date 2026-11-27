import { pool } from "../../db"
import { AppError } from '../../utils/AppError';
import type { Event } from "../event/event.type";
import type { CreateBookingSchemaType } from "./booking.schema";
import type { Booking, UserBooking } from "./booking.type";

const createBooking = async (
  payload: CreateBookingSchemaType,
  attendeeId: number
): Promise<Booking | undefined> => {
    const client = await pool.connect();
    
    //? Transaction:
    //? 1. lock the event
    //? 2. prevent organizer to book own event
    //? 3. check event date passed or not
    //? 4. check available seat
    //? 5. calculate seat
    //? 6. first decrease available seats
    //? 7. then book event
    
    try {
        await client.query("BEGIN");

        const { event_id, tickets_booked } = payload;

        const eventResult = await client.query<Event>(
            `SELECT * FROM events
            WHERE id = $1
            FOR UPDATE`,
            [event_id]
        );

        const event = eventResult.rows[0];

        if (!event) {
            throw new AppError("event not found", 404);
        }

        if (event.organizer_id === attendeeId) {
            throw new AppError("organizer booking own event", 403);
        }

        if (new Date(event.date).getTime() <= Date.now()) {
            throw new AppError("event already passed", 400);
        }

        if (event.available_seats < tickets_booked) {
            throw new AppError("insufficient seats", 400);
        }

        const totalPrice = Number(event.price) * tickets_booked;

        await client.query(
            `UPDATE events
            SET available_seats = available_seats - $1,
                updated_at = NOW()
            WHERE id = $2`,
            [tickets_booked, event_id]
        );

        const bookingResult = await client.query<Booking>(
            `INSERT INTO bookings (
                event_id,
                attendee_id,
                tickets_booked,
                total_price,
                status
            )
            VALUES ($1, $2, $3, $4, 'confirmed')
            RETURNING *`,
            [event_id, attendeeId, tickets_booked, totalPrice]
        );

        await client.query("COMMIT");

        return bookingResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const getUserBookings = async (
  userId: number
): Promise<UserBooking[]> => {
  const result = await pool.query<UserBooking>(
    `SELECT
      b.id,
      json_build_object(
        'id', e.id,
        'title', e.title,
        'date', e.date,
        'location', e.location
      ) AS event,
      b.tickets_booked,
      b.total_price,
      b.status,
      b.created_at
    FROM bookings b
    JOIN events e ON b.event_id = e.id
    WHERE b.attendee_id = $1
    ORDER BY b.created_at DESC`,
    [userId]
  );

  return result.rows;
};

const cancelBooking = async (
    bookingId: number,
    userId: number
): Promise<Booking | undefined> => {
  const client = await pool.connect();

    //? Transaction:
    //? 1. lock the booking
    //? 2. booking not found, not the owner and already cancelled resolved
    //? 3. lock event and resolve existance and date passed
    //? 4. cancel booking
    //? 5. restore available_seats of that event
  try {
    await client.query("BEGIN");

    const bookingResult = await client.query<Booking>(
      `SELECT * FROM bookings
       WHERE id = $1
       FOR UPDATE`,
      [bookingId]
    );

    const booking = bookingResult.rows[0];

    if (!booking) {
      throw new AppError("booking not found", 404);
    }

    if (booking.attendee_id !== userId) {
      throw new AppError("booking belongs to another user", 403);
    }

    if (booking.status === "cancelled") {
      throw new AppError("already cancelled", 409);
    }

    const eventResult = await client.query<Event>(
      `SELECT * FROM events
       WHERE id = $1
       FOR UPDATE`,
      [booking.event_id]
    );

    const event = eventResult.rows[0];

    if (!event) {
      throw new AppError("event not found", 404);
    }

    if (new Date(event.date).getTime() <= Date.now()) {
      throw new AppError("event already passed", 400);
    }

    const updatedBooking = await client.query<Booking>(
      `UPDATE bookings
       SET status = 'cancelled',
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [bookingId]
    );

    await client.query(
      `UPDATE events
       SET available_seats = available_seats + $1,
           updated_at = NOW()
       WHERE id = $2`,
      [booking.tickets_booked, booking.event_id]
    );

    await client.query("COMMIT");

    return updatedBooking.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const bookingsRepository = {
    createBooking,
    getUserBookings,
    cancelBooking
}

