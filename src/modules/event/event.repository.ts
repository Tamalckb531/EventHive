import { type createEventSchemaType, type updateEventSchemaType } from './event.schema';
import { pool } from "../../db"
import type { Event, EventWithOrganizer } from './event.type';
import { AppError } from '../../utils/AppError';

const createEvent = async (
  payload: createEventSchemaType,
  userId: number
): Promise<Event> => {
  const { title, description, category, date, location, total_seats, price } =
    payload;

  const result = await pool.query(
    `INSERT INTO events (
      title, description, category, date, location,
      total_seats, available_seats, price, organizer_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8)
    RETURNING *`,
    [
      title,
      description,
      category,
      date,
      location,
      total_seats,
      price,
      userId,
    ]
  );

  return result.rows[0];
};

const getEvent = async (
  search: string | undefined
): Promise<Event[]> => {
  const result = await pool.query<Event>(
    `SELECT * FROM events
     WHERE title ILIKE $1 OR description ILIKE $1
     ORDER BY created_at DESC`,
    [`%${search ?? ""}%`]
  );

  return result.rows;
};

const getOneEvent = async (id: number): Promise<EventWithOrganizer | null> => {
  const result = await pool.query(
    `SELECT 
        e.*,
        json_build_object(
            'id', u.id,
            'name', u.name,
            'email', u.email
        ) AS organizer
     FROM events e
     JOIN users u ON e.organizer_id = u.id
     WHERE e.id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
};

const updateEvent = async (
  id: number,
  payload: updateEventSchemaType,
  userId: number
): Promise<Event | undefined> => {
  const client = await pool.connect();

  //? USING TRANSACTION : 
  //? 1. get event by id(if not found or not owner then throw error)
  //? 2. Check total_seats changed (if so then get sum of confirmed ticket booked for the event calculate available_seats -> throw error if seats get negative)
  //? 3. Build dynamic query -> commit
  try {
    await client.query("BEGIN");

    const event = await client.query(
      `SELECT * FROM events
       WHERE id = $1
       FOR UPDATE`,
      [id]
    );

    if (event.rows.length === 0) {
      throw new AppError("event not found", 404);
    }

    if (event.rows[0].organizer_id !== userId) {
      throw new AppError("not the owner", 403);
    }

    let availableSeats: number | undefined;

    if (payload.total_seats !== undefined) {
      const bookingResult = await client.query(
        `SELECT COALESCE(SUM(tickets_booked), 0) As sold
         FROM bookings
         WHERE event_id = $1 AND status = 'confirmed'`,
        [id]
      );

      const sold = Number(bookingResult.rows[0].sold);

      availableSeats = payload.total_seats - sold;

      if (availableSeats < 0) {
        throw new AppError(
          "total_seats below tickets sold",
          400
        );
      }
    }

    //? Build dynamic UPDATE query
    /*?Ex:
    UPDATE events
    SET
        title = $1,
        total_seats = $2,
        available_seats = $3,
        updated_at = NOW()
    WHERE id = $4
    RETURNING *;
    */
    const fields = Object.keys(payload) as (keyof updateEventSchemaType)[]; //? ["keys"]

    const values = Object.values(payload); //? ["values"]
    const setQuery = fields.map(
      (field, index) => `${field} = $${index + 1}` //? [`keys = $n`]
    );

    if (availableSeats !== undefined) {
      values.push(availableSeats);
      setQuery.push(`available_seats = $${values.length}`); //? [...rest, `available_seats=last_index`]
    }

    values.push(id);

    const result = await client.query<Event>(
      `UPDATE events
       SET ${setQuery.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const eventRepository = {
    createEvent,
    getEvent,
    getOneEvent,
    updateEvent
}