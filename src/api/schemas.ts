import { z } from "zod";

export const errorResponseSchema = z.object({
    timestamp: z.string(),
    error: z.string(),
    status: z.number(),
    message: z.string(),
});


export type ErrorResponse = z.infer<typeof errorResponseSchema>;