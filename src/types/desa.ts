import z from "zod";

export const desaSchema = z.object({
	nama: z.string().nonempty("Nama tidak boleh kosong"),
});

export const desaFilter = z.object({
	q: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});
