import z from "zod";

export const loginSchema = z.object({
    email: z.email("Invalid Email Address"),
    password: z.string().min(1, "Password is required")
});

export const signupSchema = z.object({
    name: z.string().min(1, "Name too short"),
    email: z.email("Invalid Email Address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["attendee", "organizer"]).default("attendee"),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
export type signupSchemaType = z.infer<typeof signupSchema>;