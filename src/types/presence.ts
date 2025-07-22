import z from "zod";

export const presenceSchema = z.object({
	status: z.enum(["Hadir", "Izin", "Tidak Hadir"], {
		error: "Status tidak boleh kosong",
	}),
	event_id: z.string().nonempty("Event tidak boleh kosong"),
	generus_id: z.string().nonempty("Generus tidak boleh kosong"),
});

export const presenceFilter = z.object({
	limit: z.number().optional().default(9),
	page: z.number().optional().default(0),
});
