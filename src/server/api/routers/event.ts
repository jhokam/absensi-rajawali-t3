import type { EventWhereInput } from "@/generated/client/models";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	eventCreateSchema,
	eventDeleteSchema,
	eventFilter,
	eventUpdateSchema,
} from "@/types/event";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const event = await ctx.db.event.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Event",
			{
				items: event,
				meta: {
					limit: event.length,
					page: 1,
					total: event.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(eventFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: EventWhereInput = {
				AND: [
					{
						title: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.event.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.event.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Event",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),

	createEvent: publicProcedure
		.input(eventCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const event = await ctx.db.event.create({
				data: {
					title: input.title,
					description: input.description,
					start_date: input.start_date,
					end_date: input.end_date,
					latitude: input.latitude,
					longitude: input.longitude,
				},
			});

			return formatResponse(
				true,
				"Berhasil menambahkan data Event",
				event,
				null,
			);
		}),

	updateEvent: publicProcedure
		.input(eventUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const event = await ctx.db.event.update({
				where: {
					id: input.id,
				},
				data: {
					title: input.title,
					description: input.description,
					start_date: input.start_date,
					end_date: input.end_date,
					latitude: input.latitude,
					longitude: input.longitude,
				},
			});

			return formatResponse(true, "Berhasil mengubah data Event", event, null);
		}),

	deleteEvent: publicProcedure
		.input(eventDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const event = await ctx.db.event.delete({
				where: {
					id: input.id,
				},
			});

			return formatResponse(true, "Berhasil menghapus data Event", event, null);
		}),
});
