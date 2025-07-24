import z from "zod";
import type { EventCreateInput } from "../generated/client/models";
import { filterBase } from "./api";

export const eventCreateSchema = z.object({
	title: z
		.string()
		.nonempty("Judul tidak boleh kosong")
		.max(255, "Judul maksimal 255 karakter"),
	start_date: z.date(),
	end_date: z.date(),
	latitude: z
		.number()
		.min(-90, "Latitude minimal -90")
		.max(90, "Latitude maksimal 90"),
	longitude: z
		.number()
		.min(-180, "Longitude minimal -180")
		.max(180, "Longitude maksimal 180"),
	description: z.string().optional(),
});

export const eventUpdateSchema = eventCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const eventDeleteSchema = eventUpdateSchema.pick({
	id: true,
});

export const defaultValueEvent: EventCreateInput = {
	title: "",
	start_date: new Date(),
	end_date: new Date(),
	latitude: 0,
	longitude: 0,
	description: "",
};

export const eventFilter = filterBase;
