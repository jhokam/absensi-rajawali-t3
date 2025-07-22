import z from "zod";
import type { EventCreateInput } from "../generated/client/models";

export const eventSchema = z.object({
	title: z.string().nonempty("Judul tidak boleh kosong"),
	start_date: z.date({
		error: "Tanggal Mulai tidak boleh kosong",
	}),
	end_date: z.date({
		error: "Tanggal Selesai tidak boleh kosong",
	}),
	latitude: z.number({
		error: "Latitude tidak boleh kosong",
	}),
	longitude: z.number({
		error: "Longitude tidak boleh kosong",
	}),
	description: z.string().optional(),
});

export const defaultValueEvent: EventCreateInput = {
	title: "",
	start_date: new Date(),
	end_date: new Date(),
	latitude: 0,
	longitude: 0,
	description: "",
};

export const eventFilter = z.object({
	q: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});
