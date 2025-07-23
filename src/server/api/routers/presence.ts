import { formatResponseArray } from "@/helper/response.helper";
import { presenceFilter } from "@/types/presence";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const presenceRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const presence = await ctx.db.presence.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Presensi",
			{
				items: presence,
				meta: {
					limit: presence.length,
					page: 1,
					total: presence.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(presenceFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;

			const [data, total] = await ctx.db.$transaction([
				ctx.db.presence.findMany({
					skip: page * limit,
					take: limit,
				}),
				ctx.db.presence.count(),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Presensi",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),
});
