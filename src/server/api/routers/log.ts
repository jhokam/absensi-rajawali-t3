import type { LogWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { logFilter } from "../../../types/log";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const logRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const log = await ctx.db.log.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Log",
			{
				items: log,
				meta: {
					limit: log.length,
					page: 1,
					total: log.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(logFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: LogWhereInput = {
				AND: [
					{
						event: {
							contains: input.q,
							mode: "insensitive",
						},
					},
					{
						description: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.log.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.log.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Log",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),
});
