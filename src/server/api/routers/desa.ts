import type { DesaWhereInput } from "@/generated/client/models";
import { formatResponseArray } from "@/helper/response.helper";
import { desaFilter } from "@/types/desa";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const desaRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const desa = await ctx.db.desa.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Desa",
			{
				items: desa,
				meta: {
					limit: desa.length,
					page: 1,
					total: desa.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(desaFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const where: DesaWhereInput = {
				AND: [
					{
						nama: {
							contains: input.q,
							mode: "insensitive",
						},
					},
				],
			};

			const [data, total] = await ctx.db.$transaction([
				ctx.db.desa.findMany({
					skip: page * limit,
					take: limit,
					where,
				}),
				ctx.db.desa.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Desa",
				{ items: data, meta: { total, page, limit, totalPages } },
				null,
			);
		}),
});
