import z from "zod";

export const kelompokCreateSchema = z.object({
	id: z
		.string()
		.nonempty("ID tidak boleh kosong")
		.max(3, "ID maksimal 3 karakter"),
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(50, "Nama maksimal 50 karakter"),
	desa_id: z.number().min(1, "Desa tidak boleh kosong"),
});

export const kelompokUpdateSchema = kelompokCreateSchema;

export const kelompokDeleteSchema = kelompokUpdateSchema.pick({
	id: true,
});

export const kelompokFilter = z.object({
	q: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	desa_id: z.number().optional(),
});
