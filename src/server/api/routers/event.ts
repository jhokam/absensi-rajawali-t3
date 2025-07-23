import type { EventWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { eventFilter } from "@/types/event";
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
});
