import { type createEventSchemaType } from './event.schema';
import { pool } from "../../db"
import type { Event } from './event.type';

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

export const eventRepository = {
    createEvent
}