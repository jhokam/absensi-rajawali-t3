import z from "zod";

export const presenceCreateSchema = z.object({
	status: z
		.enum(["Hadir", "Izin", "Tidak_Hadir"], {
			error: "Status tidak boleh kosong",
		})
		.default("Tidak_Hadir"),
	event_id: z.string().nonempty("Event tidak boleh kosong"),
	generus_id: z.string().nonempty("Generus tidak boleh kosong"),
});

export const presenceUpdateSchema = presenceCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const presenceDeleteSchema = presenceUpdateSchema.pick({
	id: true,
});

export const presenceFilter = z.object({
	limit: z.number().optional().default(9),
	page: z.number().optional().default(0),
});
