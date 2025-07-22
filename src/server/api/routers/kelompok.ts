import type { KelompokWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { kelompokFilter } from "@/types/kelompok";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const kelompokRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const kelompok = await ctx.db.kelompok.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Kelompok",
			{
				items: kelompok,
				meta: {
					limit: kelompok.length,
					page: 1,
					total: kelompok.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(kelompokFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: KelompokWhereInput = {
				AND: [
					{
						desa_id: {
							equals: input.desa_id,
						},
					},
					{
						nama: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.kelompok.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.kelompok.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Kelompok",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),
});
