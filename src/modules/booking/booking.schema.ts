import z from "zod";

export const createBookingSchema = z.object({
  event_id: z.number().int().positive("invalid event ID"),
  tickets_booked: z.number().int().positive("tickets must be at least 1"),
});

export type CreateBookingSchemaType = z.infer<typeof createBookingSchema>;