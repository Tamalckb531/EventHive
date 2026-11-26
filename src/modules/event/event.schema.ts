import z from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.iso.datetime("Invalid date format"),
  location: z.string().min(1, "Location is required"),
  total_seats: z.number().int().positive("Seats must be greater than 0"),
  price: z
    .number()
    .nonnegative("Price cannot be negative")
    .refine(
      (value) => Number.isInteger(value * 100),
      "Price can have at most 2 decimal places"
    ),
});

export type createEventSchemaType = z.infer<typeof createEventSchema>;