import z from "zod";

export const logFilter = z.object({
	limit: z.number().optional().default(9),
	page: z.number().optional().default(0),
	q: z.string().optional().default(""),
});
