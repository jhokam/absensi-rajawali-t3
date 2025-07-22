import z from "zod";

export const kelompokSchema = z.object({
	nama: z.string().nonempty("Nama tidak boleh kosong"),
	desa_id: z.number().min(1, "Desa tidak boleh kosong"),
});

export const kelompokFilter = z.object({
	q: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	desa_id: z.number().optional(),
});
