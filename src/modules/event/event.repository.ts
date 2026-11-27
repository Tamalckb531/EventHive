import { type createEventSchemaType } from './event.schema';
import { pool } from "../../db"
import type { Event, EventWithOrganizer } from './event.type';

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
export const eventRepository = {
    createEvent,
    getEvent,
    getOneEvent
}